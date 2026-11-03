"""Run from the UE5 editor Python console with a new empty level open."""
import json
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
    if not manager.import_scene("/Game/Exhibits/" + system_id, source, settings):
        raise RuntimeError(f"Scene import failed: {filename}")
    unreal.log(f"Imported {system_id}. Inspect scale, materials and moving pivots before saving the level.")
