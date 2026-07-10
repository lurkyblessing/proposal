road_css = ""
start_x = 100
start_y = 100
dx = 124
dy = 62

for i in range(1, 11):
    road_css += f".road-{i} {{ top: {start_y}px; left: {start_x}px; z-index: {start_y}; }}\n"
    start_x += dx
    start_y += dy

print(road_css)
