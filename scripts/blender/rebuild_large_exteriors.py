"""Photo/brochure-referenced closed exterior geometry; dimensions remain estimates."""
import math
import bpy
from exterior_parts import group,box,cylinder,loft
from reference_surfaces import ring,material,photo_patch


def ship(m):
    root=group('Chungnam_PhotoReference');hull=group('Hull',root)
    gray=material('Naval painted steel',(.34,.37,.38),.77,.05)
    deck=material('Nonslip deck',(.16,.19,.2),.94)
    white=material('Deck painted markings',(.7,.73,.7),.84)
    rings=[]
    stations=[(-64.5,5.6,10.4),(-57,7.0,10.6),(-42,7.4,10.8),(-18,7.4,11.1),(12,7.25,11.5),(37,6.5,12.2),(53,4.1,13),(62,1.4,13.4),(64.5,.1,13.5)]
    for y,w,top in stations:
        rings.append([(-w,y,top),(-w*.98,y,6),(-w*.72,y,1.5),(-w*.28,y,.1),(w*.28,y,.1),(w*.72,y,1.5),(w*.98,y,6),(w,y,top)])
    obj=loft('Continuous flared hull',rings,gray,hull)
    for face in obj.data.polygons:face.use_smooth=True
    box('Aft flight deck',(0,-44,10.82),(13.6,34,.2),deck,hull,.1)
    loft('Sloped superstructure',[ring(-29,11.2,22,6.2,5.2),ring(-5,11.3,22.2,6.2,5.1),ring(20,11.7,24,5.4,4.5),ring(27,12,23,4.7,3.9)],gray,hull)
    # Bridge glazing and frames, photographed integrated mast silhouette, funnel and closed deck housings.
    for x in [-3.4,-2.5,-1.6,-.7,.2,1.1,2.,2.9]:box('Bridge window',(x,27.04,21.5),(.72,.04,1.1),m['glass'],hull,.035)
    loft('Integrated mast',[ring(3,22,35.8,3.6,1.9),ring(10,22,35.8,3.6,1.9)],gray,hull)
    for side in (-1,1):
        box('External sensor face',(side*2.72,6.5,31.4),(.05,3.4,3.2),m['dark'],hull,.06)
        box('External sensor face',(0,6.5+side*2.72,31.4),(3.4,.05,3.2),m['dark'],hull,.06)
    cylinder('Mast pole',(0,6,38.8),.11,6,m['steel'],hull,vertices=16)
    box('Aft hangar door',(0,-29.05,15.2),(8.4,.05,7),deck,hull,.06)
    for i in range(14):box('Hangar door seam',(0,-29.09,12+i*.48),(8.25,.02,.025),gray,hull)
    box('Funnel housing',(0,-10,25.1),(5.9,7.4,6.5),gray,hull,.18)
    for side in (-1,1):cylinder('Funnel opening',(side*1.3,-10,28.5),1,1,m['dark'],hull,vertices=40)
    for side in (-1,1):
        for y in range(-60,51,4):
            x=side*(6.6 if y<35 else 5.7)
            cylinder('Deck rail stanchion',(x,y,11.95),.04,1.2,gray,hull,vertices=8)
        for z in (11.7,12.3):cylinder('Long deck handrail',(side*6.6,-8,z),.032,104,gray,hull,'Y',8)
        for y in range(-24,25,6):box('Access hatch',(side*5.7,y,13.7),(.045,1.25,2.2),gray,hull,.05)
        for y in (-25,-18):box('Exterior boat housing',(side*6.5,y,13),(1.5,4.8,2.5),gray,hull,.18)
    # Deck circles and an H are exterior paint only.
    for side in (-1,1):box('Helideck H upright',(side*1.9,-45,10.94),(.32,6,.018),white,hull)
    box('Helideck H crossbar',(0,-45,10.94),(4.1,.32,.018),white,hull)
    turret=group('Turret',root)
    loft('Forward enclosed mount',[ring(37,12.7,16.9,1.9,1.25),ring(41,12.7,16.2,1.9,1.2)],gray,turret)
    cylinder('Forward exterior tube',(0,45,15.5),.13,9,gray,turret,'Y',32)
    for x in (-2.1,2.1):box('Closed deck equipment',(x,30,12.8),(3.2,5.7,.38),gray,hull,.08)
    return root


def truck(m):
    root=group('Chunmoo_PhotoReference');hull=group('Hull',root)
    box('Chassis',(0,0,1.0),(2.1,8.7,.35),m['steel'],hull,.08)
    for side in (-1,1):
        for y in (-3.2,-1.65,1.5,3.2):
            x=side*1.19
            cylinder('Wheel tire',(x,y,.68),.63,.4,m['rubber'],hull,'X',64)
            cylinder('Recessed wheel rim',(x+side*.215,y,.68),.38,.025,m['paint'],hull,'X',48)
            cylinder('Wheel hub',(x+side*.24,y,.68),.16,.09,m['steel'],hull,'X',24)
            for i in range(12):
                angle=i*math.tau/12
                cylinder('Wheel fastener',(x+side*.24,y+math.sin(angle)*.26,.68+math.cos(angle)*.26),.018,.025,m['steel'],hull,'X',6)
            for i in range(38):
                angle=i*math.tau/38
                tread=box('Tire tread',(x,y+math.sin(angle)*.616,.68+math.cos(angle)*.616),(.42,.14,.075),m['rubber'],hull)
                tread.rotation_euler.x=-angle
    loft('Angular protected cabin',[ring(1.6,1.2,3.1,1.18,1.06),ring(3.4,1.2,3.1,1.18,1.06),ring(4.4,1.4,2.6,1.05,.94)],m['paint'],hull)
    for side in (-1,1):
        window=box('Windscreen',(side*.51,3.93,2.91),(.87,.055,.52),m['glass'],hull,.04);window.rotation_euler.x=.46
        box('Cab door',(side*1.19,2.45,2.22),(.04,1.42,1.6),m['paint'],hull,.035)
        box('Cab side glass',(side*1.222,2.68,2.73),(.025,.86,.52),m['glass'],hull,.035)
        cylinder('Door handle',(side*1.23,2.1,2.24),.022,.23,m['steel'],hull,'Y',12)
        for z in (1.08,1.32):box('Cab steps',(side*1.2,2.4,z),(.3,1.2,.07),m['steel'],hull)
        cylinder('Mirror support',(side*1.42,3.3,2.9),.025,.8,m['steel'],hull,vertices=12)
        box('Exterior mirror',(side*1.5,3.3,3.03),(.08,.24,.36),m['dark'],hull,.035)
        cylinder('Lamp',(side*.83,4.46,1.8),.09,.04,m['glass'],hull,'Y',32)
    for i in range(10):box('Front grille',(0,4.47,2.1+i*.035),(1.3,.02,.018),m['dark'],hull)
    box('Front bumper',(0,4.5,1.26),(2.62,.22,.25),m['steel'],hull,.04)
    box('Rear equipment deck',(0,-1.55,1.48),(2.55,5.8,.22),m['paint'],hull,.04)
    equipment=group('ClosedExternalHousings',root)
    for side in (-1,1):
        box('Closed exterior container',(side*.6,-1.8,2.52),(1.12,4.45,1.5),m['paint'],equipment,.045)
        for y in (-3.65,-2.65,-1.65,-.65):box('Container external strap',(side*.6,y,3.3),(1.18,.06,.06),m['steel'],equipment)
        for z in (2.02,2.55,3.05):box('Container rear seam',(side*.6,-4.04,z),(1.0,.025,.028),m['dark'],equipment)
        for y in (-3.7,.25):box('Stowed external support',(side*1.22,y,1.7),(.25,.28,.65),m['steel'],hull,.02)
    photo_patch('Chunmoo photographed cab side',[(1.25,1.65,1.35),(1.25,1.65,2.5),(1.25,3.4,2.5),(1.25,3.4,1.35)],[(551,511),(560,303),(846,306),(858,508)],'public/media/reference-verified/chunmoo-side.jpg',hull)
    return root
