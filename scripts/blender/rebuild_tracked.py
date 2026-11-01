"""K21 and K216 specific exterior rebuilds using inspected public photos."""
import sys
from pathlib import Path
import bpy
sys.path.insert(0,str(Path('scripts/blender').resolve()))
from exterior_parts import group,box,cylinder,loft
from reference_surfaces import tracks,ring,photo_patch


def build(identity,m):
    k21=identity=='k21';length=6.9 if k21 else 5.7;width=3.4 if k21 else 2.85
    root=group(identity.upper()+'_PhotoExterior');hull=group('Hull',root)
    tracks(root,length-.4,width,6 if k21 else 5,m)
    rear=-length/2;front=length/2
    loft('Angled welded hull',[ring(rear,.58,1.88,1.03,width/2-.13),ring(front-1.35,.5,1.9,1.05,width/2-.12),ring(front,.75,1.12,1.06,width/2-.18)],m['paint'],hull)
    for side in (-1,1):
        for i in range(5):
            y=rear+.6+i*(length-1.2)/5
            panel=box('Side access panel',(side*(width/2-.07),y,1.55),(.09,(length-1.25)/5,.62),m['paint'],hull,.012)
            for z in (1.33,1.78):cylinder('Panel hinge',(side*(width/2-.01),y-.2,z),.022,.14,m['steel'],hull,'Y',12)
        for z in (1.18,1.27,1.36):
            cylinder('External stowage rod',(side*(width/2+.02),rear+1.4,z),.026,2.2,m['paint'],hull,'Y',16)
        box('Front lamp enclosure',(side*(width/2-.45),front-.28,1.36),(.42,.2,.23),m['dark'],hull,.025)
        cylinder('Lamp glass',(side*(width/2-.45),front-.165,1.36),.075,.025,m['glass'],hull,'Y',32)
        for y in (rear+.3,front-.8):
            cylinder('Tow eye',(side*.9,y,.95),.065,.09,m['steel'],hull,'Y',16)
    # Deck has separate access plates, hinges and bolt patterns.
    for x in (-.74,.74):
        box('Deck hatch',(x,.6,1.923),(.86,1.05,.035),m['paint'],hull,.025)
        for y in (.18,1.02):box('Hatch hinge',(x,y,1.96),(.2,.045,.04),m['steel'],hull)
    if k21:
        turret=group('Turret',root)
        loft('K21 angular turret',[ring(-1.35,1.99,2.72,1.03,.92),ring(.62,1.96,2.69,.95,.84),ring(1.0,2.1,2.6,.55,.5)],m['paint'],turret)
        gun=group('Gun',turret);cylinder('Mantlet',(0,.85,2.3),.2,.45,m['steel'],gun,'Y',40)
        cylinder('40mm exterior tube',(0,2.2,2.3),.055,2.5,m['steel'],gun,'Y',40)
        for side in (-1,1):
            cylinder('Turret closed hatch',(side*.52,-.45,2.75),.29,.07,m['paint'],turret,'Z',40)
            box('Optical sight enclosure',(side*.68,.48,2.86),(.32,.3,.34),m['paint'],turret,.035)
            box('Optical face',(side*.68,.64,2.86),(.24,.014,.26),m['glass'],turret)
            for y in (-1.05,-.65,-.25):cylinder('Basket upright',(side*1.13,y,2.45),.022,.42,m['steel'],turret,'Z',12)
            for z in (2.27,2.65):cylinder('Basket rail',(side*1.13,-.65,z),.022,1.15,m['steel'],turret,'Y',12)
        # Actual photo-painted trim vane, with manual perspective anchors; no people projected.
        photo_patch('K21 photo trim vane',[(-1.48,front+.012,.82),(1.48,front+.012,.82),(1.48,front+.012,1.33),(-1.48,front+.012,1.33)],[(100,682),(1016,712),(1058,542),(80,532)],'public/media/reference-verified/k21-front.jpg',hull)
    else:
        cylinder('Raised cupola',(0,-.15,2.06),.56,.27,m['paint'],hull,'Z',48)
        cylinder('Closed cupola hatch',(0,-.15,2.23),.47,.045,m['paint'],hull,'Z',48)
        box('Roof reconnaissance equipment',(.85,-1.6,2.15),(.62,.85,.42),m['paint'],hull,.04)
        for x in (-.95,.95):cylinder('Roof mast',(x,-2.1,2.6),.018,1.5,m['steel'],hull,'Z',12)
        for i in range(5):cylinder('Front roof exterior tubes',(-.65+i*.24,1.0,2.0),.09,.3,m['steel'],hull,'Y',24)
        # The photographed front is a sloped welded face, not a rectangular toy block.
        photo_patch('K216 photo glacis',[(-1.22,front+.008,1.13),(1.22,front+.008,1.13),(1.27,front-1.342,1.91),(-1.27,front-1.342,1.91)],[(54,349),(564,347),(590,215),(93,226)],'public/media/reference-verified/k216-dvids.jpg',hull)
    return root
