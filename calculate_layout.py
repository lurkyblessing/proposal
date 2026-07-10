import math

grid_left = 200
grid_top = 100
grid_size = 800

def project(u, v):
    cu, cv = u - grid_size/2, v - grid_size/2
    
    rad_z = math.radians(-45)
    cos_z, sin_z = math.cos(rad_z), math.sin(rad_z)
    x1 = cu * cos_z - cv * sin_z
    y1 = cu * sin_z + cv * cos_z
    
    y2 = y1 * math.cos(math.radians(60))
    
    screen_x = grid_left + grid_size/2 + x1
    screen_y = grid_top + grid_size/2 + y2
    return screen_x, screen_y

# Block centers in the unrotated grid
blocks = {
    "0,0": (155, 155),
    "1,0": (405, 155),
    "2,0": (655, 155),
    "0,1": (155, 405),
    "1,1": (405, 405),
    "2,1": (655, 405),
    "0,2": (155, 655),
    "1,2": (405, 655),
    "2,2": (655, 655),
}

for name, (u, v) in blocks.items():
    sx, sy = project(u, v)
    print(f"Block {name}: screen center = ({sx:.1f}, {sy:.1f})")

