const formulario = document.querySelector("#formulario");
const cardsEstudiantes = document.querySelector("#cardsEstudiantes");
const cardsProfesores = document.querySelector("#cardsProfesores");
const templateEstudiante = document.querySelector(
    "#templateEstudiante"
).content;
const templateProfesor = document.querySelector("#templateProfesor").content;
const alert = document.querySelector(".alert");

const estudiantes = [];  //creo array donde voy a acumular los objetos que se creen  y para poder utilizar el forEach  para poder pintarlos en el html
const profesores = [];

document.addEventListener("click", (e) => {
    // console.log(e.target.dataset.nombre);
    if (e.target.dataset.uid) {
        // console.log(e.target.matches(".btn-success"));
        if (e.target.matches(".btn-success")) {
            estudiantes.map(item => {
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = true
                }
                console.log(item); // al clickear en aprobar el estado vamos a ver que esta en false
                return item
            })

        }
        if (e.target.matches('.btn-danger')) {
            estudiantes.map(item => {
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = false
                }
                console.log(item); // al clickear en aprobar el estado vamos a ver que esta en false
                return item
            })
        }
        Persona.pintarPersonaUI(estudiantes, "Estudiante") //tenemos que volver a pintar la card porq se modifica la cad al clickear en aprobar o reprobar
    }
})


formulario.addEventListener("submit", e => {

    e.preventDefault();

    alert.classList.add('d-none'); //porque cuando lo removemos en la linea ... porque se envio un espacio en blanco el cartel del html en rojo se nos va a quedar si luego enviamos otra vez el campo pero sin espacio entonces en esta linea cada vez que enviamos el formulario (evento de submit) vamos a agregar el d-none a la etiqueta

    const datos = new FormData(formulario);
    console.log(datos);
    console.log(datos.values());   //salida:iterator {}
    console.log([...datos.values()]); //destructuring devuelve un array con los datos, explicacion linea 24 de como asignamos cada dato a cada variable


    const [nombre, edad, opcion] = [...datos.values()] //destructuring: esta sintaxis permite desempacar valores de arrays o propiedades de obetos en distintas variables, en este caso estamos diciendo que los valores que vengan de el formulario se asiguen (por posicion) a las variables del array de la izquierda del igual. 
    // console.log(opcion);
    console.log(nombre, edad, opcion);

    if (!nombre.trim() || !edad.trim() || !opcion.trim()) { //trim devuelve 
        console.log("algun dato en blanco");
        alert.classList.remove('d-none');
        return
    }



    if (opcion === "Estudiante") {

        const estudiante = new Estudiante(nombre, edad)
        // console.log(estudiante);
        estudiantes.push(estudiante) //linea11
        // console.log(estudiantes);
        Persona.pintarPersonaUI(estudiantes, opcion)

    }

    if (opcion === "Profesor") {
        // console.log("profesor");

        const profesor = new Profesor(nombre, edad);

        profesores.push(profesor);
        // console.log(profesores);

        Persona.pintarPersonaUI(profesores, opcion)

    }



})

class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
        this.uid = `${Date.now()}`; //id de usuario provisorio (no se tendria que hacer asi), esta entre `${}` para tranformarlo a string porque al hacer el matches para q coinsidan entre los dos uid del evento de la card con uid del objeto en cuestion, al estar en el html lo podemos ver que esta en tipo string y en la consola sin pasarlo a string como hicimos en esta linea esta en tipo number entonces no van a coinsidir otra opcion era que en los if en ves de hacerlo con el identico (===) hacerlo con el igual (==)
    }

    static pintarPersonaUI(personas, tipo) {  //UI: se usa cuando queremos decir que con esta funcion vamos a pintar en el html
        if (tipo === "Estudiante") {
            cardsEstudiantes.textContent = "";

            const fragment = document.createDocumentFragment();


            personas.forEach(item => {
                fragment.appendChild(item.agregarNuevoEstudiante())
                console.log(personas);
            })
            cardsEstudiantes.appendChild(fragment);
        }

        if (tipo === "Profesor") {
            cardsProfesores.textContent = "";

            const fragment = document.createDocumentFragment();

            personas.forEach(item => {
                fragment.appendChild(item.agregarNuevoProfesor())
            })

            cardsProfesores.appendChild(fragment)

        }

    }

}

class Estudiante extends Persona {
    #estado = false;
    #estudiante = "Estudiante";

    set setEstado(estado) {
        this.#estado = estado
    }

    get getEstudiante() {
        return this.#estudiante;
    }

    agregarNuevoEstudiante() {
        const clone = templateEstudiante.cloneNode(true)

        clone.querySelector('h5 .text-primary').textContent = this.nombre; // el nombre y la edad vienen al instanciar el objeto en la escucha de evento del formulario 
        clone.querySelector('h6').textContent = this.getEstudiante;
        clone.querySelector('p').textContent = this.edad;

        if (this.#estado) {

            clone.querySelector('.badge').className = "badge bg-success"; //className remplaza la clase actual por la que coloquemos dentro de las comillas
            clone.querySelector('.btn-success').disabled = true
            clone.querySelector('.btn-danger').disabled = false
        } else {

            clone.querySelector('.badge').className = "badge bg-danger";
            clone.querySelector('.btn-danger').disabled = true
            clone.querySelector('.btn-success').disabled = false

        }

        clone.querySelector('.badge').textContent = this.#estado ? "Aprobado" : "Reprobado"; //operador ternario (?:) si this.#estado es verdadero el contenido de la etiqueta con la clase badge es Aprobado si es false reprobado //lo hacemos fuera de los if porq asi es dinamico y no ay q agregar a los dos

        clone.querySelector('.btn-success').dataset.uid = this.uid
        clone.querySelector('.btn-danger').dataset.uid = this.uid

        return clone
    }
}

class Profesor extends Persona {
    #profesor = "profesor"

    agregarNuevoProfesor() {
        const clone = templateProfesor.cloneNode(true);

        clone.querySelector('h5').textContent = this.nombre;
        clone.querySelector('h6').textContent = this.#profesor;
        clone.querySelector('.lead').textContent = this.edad;

        return clone;

    }
}



