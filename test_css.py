def generate_blocks():
    css = ""
    css += ".block { position: absolute; width: 210px; height: 160px; display: flex; justify-content: center; align-items: flex-end; transform-style: preserve-3d; }\n"
    
    css += ".b-0-0 { left: 40px; top: 40px; }\n"
    css += ".b-1-0 { left: 290px; top: 40px; }\n"
    css += ".b-2-0 { left: 540px; top: 40px; }\n"
    
    css += ".b-0-1 { left: 40px; top: 240px; }\n"
    css += ".b-1-1 { left: 290px; top: 240px; }\n"
    css += ".b-2-1 { left: 540px; top: 240px; }\n"
    
    css += ".b-0-2 { left: 40px; top: 440px; }\n"
    css += ".b-1-2 { left: 290px; top: 440px; }\n"
    css += ".b-2-2 { left: 540px; top: 440px; }\n"
    
    css += ".stand-up { transform-origin: center bottom; transform: rotateZ(45deg) rotateX(-60deg); }\n"
    
    print(css)

generate_blocks()
