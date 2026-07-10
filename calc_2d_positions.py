import math

world_w, world_h = 1200, 1000
grid_w, grid_h = 800, 650

def project(u, v):
    # u, v are relative to top-left of the unrotated grid
    # center of grid is 400, 325
    cu = u - grid_w/2
    cv = v - grid_h/2
    
    rad_z = math.radians(-45)
    cos_z, sin_z = math.cos(rad_z), math.sin(rad_z)
    x1 = cu * cos_z - cv * sin_z
    y1 = cu * sin_z + cv * cos_z
    
    # rotate X 60deg
    y2 = y1 * math.cos(math.radians(60))
    
    # add to screen center
    screen_x = world_w/2 + x1
    screen_y = world_h/2 + y2
    return screen_x, screen_y

centers = {
    "0,0": (145, 120),
    "1,0": (395, 120),
    "2,0": (645, 120),
    
    "0,1": (145, 320),
    "1,1": (395, 320),
    "2,1": (645, 320),
    
    "0,2": (145, 520),
    "1,2": (395, 520),
    "2,2": (645, 520),
}

print("/* Projected Building Positions */")
for name, (u, v) in centers.items():
    sx, sy = project(u, v)
    # The calculated screen_y is the ground plane center.
    # To place a building image so its base is at this point,
    # we can just use left: sx, top: sy, and transform: translate(-50%, -100%)
    print(f"/* Block {name} */")
    print(f".b-{name.replace(',', '-')} {{ left: {sx:.1f}px; top: {sy:.1f}px; z-index: {int(sy)}; }}")

