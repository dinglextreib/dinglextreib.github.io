
let runTime = 0
const fps = 60
let crt
let canvas
let context
let planets = []
let show_info = false
let paused = false
let plt_list
let para
let hlp
let acin
let save_file
let ctr_mode
let neg_acc
let last_sv

const grav_const = 6.6743


function magnitude(a, b) {
    let unt = unit(a, b)
    return Math.sqrt(unt.x**2 + unt.y**2)
}

function unit(a, b) {
    let dx = a.position.x - b.position.x
    let dy = a.position.y - b.position.y
    return {x:dx, y:dy}    
}

function grav_eq(a, b) {
    return (a.mass * grav_const)/(magnitude(a, b)**2)
}

function object_new(name, mass, size, color) {
    const plt = {name:name, mass:mass, size:size, color:color}
    plt.position = {x:0, y:0}
    plt.velocity = {x:0, y:0}
    planets.push(plt)

    btn = document.createElement("button")
    btn.style.width = "100%"
    btn.className = "list"
    plt.button = btn
    btn.innerHTML = plt.name
    if (plt.name == "") {
        plt.button.innerHTML = "bez názvu"
    }
    btn.onclick = function() {hlp = plt; show_props(); if (paused) {dis(false)}}
    document.getElementById("pltls").appendChild(btn)
    hlp = plt; show_props()

    plt.destroy = function() {
        planets.splice(planets.indexOf(this), 1)
        this.button.remove()
        if (hlp == this) {
            hlp = undefined
            for (let x of prlt) {
                document.getElementById(x).value = ""
                document.getElementById(x).disabled = true
            }
        }
    }

    return plt
}

function acc() {
    if (parseFloat(acin.value)!= 0) {
        let cf = parseFloat(acin.value); if (neg_acc) {cf = -parseFloat(acin.value); console.log("sss")}
        force(hlp, {x:hlp.velocity.x, y:hlp.velocity.y}, cf)
    }
    
}

function delAll() {
    let tmp = planets.slice()
    for (let x of tmp) {
        x.destroy()
    }

}

function show_props() {
    if (hlp != undefined) {
        document.getElementById("na").value = hlp.name
        document.getElementById("st_mass").value = hlp.mass
        document.getElementById("st_size").value = hlp.size
        document.getElementById("st_x").value = hlp.position.x
        document.getElementById("st_y").value = -hlp.position.y
        document.getElementById("st_vx").value = hlp.velocity.x
        document.getElementById("st_vy").value = hlp.velocity.y
    }
}

function update_props() {
    if (hlp != undefined) {
        hlp.name = document.getElementById("na").value 
        hlp.mass = parseFloat(document.getElementById("st_mass").value)
        hlp.size = parseFloat(document.getElementById("st_size").value)
        hlp.position.x = parseFloat(document.getElementById("st_x").value) 
        hlp.position.y = -parseFloat(document.getElementById("st_y").value)
        hlp.velocity.x = parseFloat(document.getElementById("st_vx").value)
        hlp.velocity.y = parseFloat(document.getElementById("st_vy").value)
        hlp.button.innerHTML = hlp.name
        if (hlp.name == "") {
            hlp.button.innerHTML = "bez názvu"
    }   
    }
}

function switch_si() {
    if (show_info) {
        show_info = false
        document.getElementById("si").innerHTML = "Ukázat info"
    } else {
        show_info = true
        document.getElementById("si").innerHTML = "Schovat info"
    }
}

let prlt = ["na", "st_mass", "st_size", "st_x", "st_y", "del", "st_vx", "st_vy"]

function switch_p() {
    if (paused) {
        paused = false
        document.getElementById("p").innerHTML = "Pozastavit"
        dis(true)      
    } else {
        paused = true
        document.getElementById("p").innerHTML = "Spustit"
        dis(false)
        if (hlp == undefined) {
          dis(true)  
        }
        show_props()
    }
}

function dis(tr) {
    for (let x of prlt) {
        document.getElementById(x).disabled = tr
    }
}

function update() {
    runTime += 1000/fps
    c = Math.sin(runTime/100);
    c = (c+1)/2*255
    crt.style.color = `rgb(${255},${c},${255})`;

    

    app_loop()
}

addEventListener("keydown", function(event) {
    if (event.key == "Control") {
        neg_acc = true
        document.getElementById("acc").style.color = "rgb(157, 0, 0)"
        document.getElementById("acc").innerHTML = "Akcelerovat planetu (Negativ)"
    }
})

addEventListener("keyup", function(event) {
    if (event.key == "Control") {
        
        neg_acc = false
        document.getElementById("acc").style.color = "#313131"
        document.getElementById("acc").innerHTML = "Akcelerovat planetu"
    }
})

    

function force(obj, dir, acc) {
    if (dir.x != 0 || dir.y != 0) {
        let rt = acc/(Math.abs(dir.x) + Math.abs(dir.y))
        obj.velocity.x += (dir.x * rt)
        obj.velocity.y += (dir.y * rt)
    }
}

function ld_ex() {
    delAll()
    pl = object_new("Země", 5, 10, "green")
    pl1 = object_new("Slunce", 8000, 30, "yellow")
    moon = object_new("Měsíc", 1/81, 5, "gray")
    m = object_new("Venuše", 2, 9, "orange")
    m.position.x = -185
    m.velocity.y = 115
    moon.position.x = -385
    moon.velocity.y = -90
    pl.position.x = -400
    pl.velocity.y = -79.5
}

function app_loop() {
    if (!paused) {show_props()}
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let x of planets) {
        if (!paused) {
            x.position.x += x.velocity.x/fps
            x.position.y += x.velocity.y/fps
        }
        
    }

    for (let p of planets) {
        if (!paused) {           
            for (let trgt of planets) {
                if (trgt != p) {
                    let acc = grav_eq(p, trgt)
                    force(trgt, unit(p, trgt), acc)
                }
            }         
        }

        context.beginPath();   
        context.arc(
            p.position.x + canvas.width/2,
            p.position.y + canvas.height/2,
            p.size, 0, 2 * Math.PI)
        context.fillStyle = p.color
        context.fill();
        context.stroke();

        if (show_info) {
            context.font = "15px Arial"
            context.fillStyle = "white"
            context.fillText(`vel: ${Math.round(p.velocity.x)}, ${Math.round(-p.velocity.y)}`,
                p.position.x + canvas.width/2, p.position.y + canvas.height/2)
            context.fillText(`pos: ${Math.round(p.position.x) }, ${Math.round(-p.position.y)}`,
                p.position.x + canvas.width/2, p.position.y - 15 + canvas.height/2)
            context.font = "20px Arial"
            if (p.name == "") {
                context.fillText("bez názvu" ,p.position.x + canvas.width/2, p.position.y -30 + canvas.height/2)
            } else {
                context.fillText(p.name ,p.position.x + canvas.width/2, p.position.y -30 + canvas.height/2)
            }
        }
    }

    

}

function n() {
    object_new("", 300, 10, "green")
    dis(false)
}

function save_session() {
    if (!last_sv) {last_sv = "název"}
    let svn = window.prompt("Uložit všechny planety a jejich nastavení.", last_sv);
    if (!svn) {return}   
    console.log("n")
    const sv_tab = {name:svn, plts:planets.slice()}
    let str = JSON.stringify(sv_tab)
    let ret = JSON.parse(localStorage.getItem("grv"))
    let ans
    for (let x in ret) {
        if (JSON.parse(ret[x]).name == svn) {
            ans = window.confirm("S tímto názvem už uložená pozice existuje, kliknutím na OK ji přepíšete")
            if (ans) {
                ret[x] = str
                localStorage.setItem("grv", JSON.stringify(ret))
                last_sv = JSON.parse(ret[x]).name
                refresh_saves()
            }
            return
        }
    }
    ret.push(str)
    console.log("sss")
    localStorage.setItem("grv", JSON.stringify(ret))
    last_sv = sv_tab.name
    refresh_saves()
    
}

function refresh_saves() {
    while (svs.firstChild) {
        svs.removeChild(svs.lastChild);
    }
    let def = document.createElement("option")
    def.value = "Načíst"
    def.disabled = true
    def.hidden = true
    def.selected = true
    def.innerHTML = "Načíst"
    svs.appendChild(def)
    save_file = []

    if (!localStorage.getItem("grv")) {
        localStorage.setItem("grv", JSON.stringify([]))
        console.log("new f")
    }  

    let sv = JSON.parse(localStorage.getItem("grv")) 

    
    

    
    console.log(sv)

    for (let x of sv) {
        let dat = JSON.parse(x)
        let tag = document.createElement("option")
        svs.appendChild(tag)
        save_file.push(dat)
        tag.value = save_file.length - 1
        //tag.id = dat.name
        tag.innerHTML = dat.name
        
        
        console.log(x)
        console.log("crt")
    }
}

function load_session() {
    if (svs.value != "Načíst") {
        delAll()
        console.log(svs.value)
        planets = []
        for (let x of save_file[svs.value].plts) {
            let s = object_new(x.name, x.mass, x.size, x.color)
            s.position = {x:x.position.x, y:x.position.y}
            s.velocity = {x:x.velocity.x, y:x.velocity.y}
        }
        svs.value = "Načíst"
        if (!paused) {switch_p()}
    }
}

function enter_canvas() {
    if (!ctr_mode) {
        ctr_mode = true
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        canvas.style.position = "fixed"
        canvas.style.left = 0
        canvas.style.top = 0
        canvas.style.zIndex = 1000
    }
}

function start() {
    let svs = document.getElementById("svs")
    //localStorage.removeItem("grv")
    
    console.log(JSON.parse(localStorage.getItem("grv")))
    crt = document.getElementById("credit")
    canvas = document.getElementById("canvas")
    context = canvas.getContext('2d')
    plt_list = document.getElementById("pltls")
    acin = document.getElementById("ac")
    refresh_saves()

    ld_ex()
    //switch_p()
    setInterval(update, 1000/fps) 
}

