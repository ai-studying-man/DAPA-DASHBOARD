"""Run from the UE5 editor Python console with a new empty level open."""
import json
import math
import time
from pathlib import Path

import unreal


def import_exhibit(system_id):
    repo = Path(unreal.Paths.convert_relative_path_to_full(unreal.Paths.project_dir())).parents[1]
    entries = json.loads((repo / "src/fleet-assets.json").read_text(encoding="utf-8"))
    entry = next(row for row in entries if row["id"] == system_id)
    filename = (repo / "public" / entry["model"]).resolve()
    manager = unreal.InterchangeManager.get_interchange_manager_scripted()
    source = manager.create_source_data(str(filename))
    settings = unreal.ImportAssetParameters()
    settings.automated = True
    actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
    existing = {actor.get_path_name() for actor in actors.get_all_level_actors()}
    if not manager.import_scene("/Game/Exhibits/" + system_id, source, settings):
        raise RuntimeError(f"Scene import failed: {filename}")
    tag = "DAPA_" + system_id
    imported = [actor for actor in actors.get_all_level_actors() if actor.get_path_name() not in existing]
    if not imported:
        raise RuntimeError("Scene import created no level actors. Use an empty level.")
    for actor in imported:
        actor.tags = list(actor.tags) + [unreal.Name(tag)]
    unreal.log(f"Imported {system_id}. Inspect scale, materials and moving pivots before saving the level.")


def play_exhibit(system_id):
    """Orbit tagged geometry in a real PIE world and record observed camera travel."""
    level = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    if level.is_in_play_in_editor():
        raise RuntimeError("Stop the current play session before starting this review.")
    worlds = unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem)
    gameplay = unreal.GameplayStatics
    tag = unreal.Name("DAPA_" + system_id)
    if not gameplay.get_all_actors_with_tag(worlds.get_editor_world(), tag):
        raise RuntimeError("Import this exhibit into the current level before playback.")
    camera_tag = unreal.Name("DAPA_review_camera")
    actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
    editor_camera = actors.spawn_actor_from_class(unreal.CameraActor, unreal.Vector())
    editor_camera.tags = [camera_tag]
    editor_camera.root_component.set_mobility(unreal.ComponentMobility.MOVABLE)
    started = time.monotonic()
    camera = center = None
    radius = 0
    elapsed = 0
    samples = []

    def tick(delta):
        nonlocal camera, center, radius, elapsed
        try:
            world = worlds.get_game_world()
            if not world or not level.is_in_play_in_editor():
                if camera or time.monotonic() - started > 45:
                    raise RuntimeError("PIE unavailable or ended before playback completed.")
                return
            if not camera:
                targets = gameplay.get_all_actors_with_tag(world, tag)
                controller = gameplay.get_player_controller(world, 0)
                if not targets or not controller:
                    if time.monotonic() - started > 45:
                        raise RuntimeError("PIE player or exhibit missing.")
                    return
                boxes = [actor.get_actor_bounds(False) for actor in targets]
                low, high = [], []
                for axis in ("x", "y", "z"):
                    low.append(min(getattr(o, axis)-getattr(e, axis) for o,e in boxes))
                    high.append(max(getattr(o, axis)+getattr(e, axis) for o,e in boxes))
                center = unreal.Vector(*[(a+b)/2 for a,b in zip(low,high)])
                radius = max(math.dist(low, high)*1.35, 5)
                camera = gameplay.get_all_actors_with_tag(world, camera_tag)[-1]
                controller.set_view_target_with_blend(camera)
            elapsed += delta
            angle = min(elapsed/6, 1)*math.tau
            location = center + unreal.Vector(radius*math.cos(angle), radius*math.sin(angle), .42*radius)
            rotation = unreal.MathLibrary.find_look_at_rotation(location, center)
            camera.set_actor_location_and_rotation(location, rotation, False, True)
            if len(samples) <= min(int(elapsed), 6):
                observed = camera.get_actor_location()
                samples.append([observed.x, observed.y, observed.z])
            if elapsed < 6 or len(samples) < 7:
                return
            if max(math.dist(samples[0], p) for p in samples) < radius:
                raise RuntimeError("Camera did not traverse the exhibit.")
            folder = Path(unreal.Paths.convert_relative_path_to_full(unreal.Paths.project_saved_dir()))
            (folder / ("PIE-" + system_id + ".json")).write_text(
                json.dumps({"system":system_id,"engine":unreal.SystemLibrary.get_engine_version(),
                            "world":world.get_path_name(),"seconds":elapsed,"positions":samples}, indent=2))
        except Exception as exc:
            unreal.log_error(str(exc))
        unreal.unregister_slate_post_tick_callback(handle)
        level.editor_request_end_play()
        def cleanup(_delta):
            if not level.is_in_play_in_editor():
                actors.destroy_actor(editor_camera)
                unreal.unregister_slate_post_tick_callback(cleanup_handle)
        cleanup_handle = unreal.register_slate_post_tick_callback(cleanup)

    handle = unreal.register_slate_post_tick_callback(tick)
    level.editor_request_begin_play()
