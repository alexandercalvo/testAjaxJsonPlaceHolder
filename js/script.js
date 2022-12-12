// declaracion de variables  y constantes 

let $d = document,
    $btnSend = $d.querySelector('.container-form__send'),
    $btnUpdate = $d.querySelector('.container-form__update'),
    $btanDelete = $d.querySelector('.container-form__delete'),
    $form = $d.querySelector('.container-form__form'),
    $template = $d.querySelector('.register-table').content,
    $fragment = $d.createDocumentFragment(),
    $tableBody = $d.querySelector('#section-table__body'),
    $tableRow;


//metodo para convertir un form-data a json
const converFormdataToJson = (formdata) =>{
  console.log(formdata);
  let user ={};
   formdata.forEach((value, key)=>{
    user[key]= value;
  });
  return user;
}

//metodo para mostrar los usuarios nuevos sin recargar
const showUserNew = (user) =>{
    $template.querySelector('.register-table__id').textContent = user.id;
    $template.querySelector('.register-table__name').textContent = user.firstName;
    $template.querySelector('.register-table__lastname').textContent = user.lastName;
    $template.querySelector('.register-table__email').textContent = user.email;
    $template.querySelector('.register-table__phone').textContent = user.phone;
    $template.querySelector('.register-table__address').textContent = user.address;

    $template.querySelector('.register-table__update').setAttribute('data-id', user.id);
    $template.querySelector('.register-table__delete').setAttribute('data-id', user.id);
    //clonando el template para no repetir informacion
    let $cloneTemplate = $d.importNode($template, true);
    $fragment.appendChild($cloneTemplate);
    $tableBody.appendChild($fragment); 

}

//funcion para limpiar el formulario
const clearForm = () =>{
  console.log('borrando')
  $form.id.value = "";
  $form.firstName.value= "";
  $form.lastName.value= "";
  $form.email.value= "";
  $form.phone.value= "";
  $form.address.value= "";
  $btnSend.textContent='Nuevo';
  $btnSend.classList.remove('container-form__update');
  $btnSend.classList.add('container-form__send')

}
//metodo para mostrar todos  los usuarios ala carga del documento la tabla
const showUserToTable = (users) =>{
  users.map((user)=>{   
    $template.querySelector('.register-table__id').textContent = user.id;
    $template.querySelector('.register-table__name').textContent = user.firstName;
    $template.querySelector('.register-table__lastname').textContent = user.lastName;
    $template.querySelector('.register-table__email').textContent = user.email;
    $template.querySelector('.register-table__phone').textContent = user.phone;
    $template.querySelector('.register-table__address').textContent = user.address;
    $template.querySelector('.register-table__update').setAttribute('data-id', user.id);
    $template.querySelector('.register-table__delete').setAttribute('data-id', user.id);
    //clonando el template para no repetir informacion
    let $cloneTemplate = $d.importNode($template, true);
    $fragment.appendChild($cloneTemplate);
  });

  $tableBody.appendChild($fragment); 

}

//metodo para que se ejecutara una vez el API responda
const test = (user) =>{
  let json = JSON.parse(user)
  $form.firstName.value = json.firstName;
  $form.lastName.value = json.lastName;
  $form.email.value = json.email;
  $form.phone.value = json.phone;
  $form.address.value = json.address;
  $form.id.value = json.id  ;
}

//metodo para cargar usurio en el formulario
const fillFieldsForm = (id, component) =>{
  $btnSend.textContent='Actualizar';
  $btnSend.classList.add('container-form__update');
  $btnSend.classList.remove('container-form__send');
  $tableRow = component.parentNode.parentNode;
  getUserForId(id, test);
}

//metodo para agregar un usuario a la api de json-placeholder
const createUser = (user) =>{
  //variable para usar ajax
  let xhr = new XMLHttpRequest();
  //funcion que se ejecutara una vez termine de enviarse la info
  xhr.onload = () =>{
    if(xhr.status > 200 && xhr.status < 400){
      alert('Usuario agregado');
      console.log(xhr.response);
      showUserNew(JSON.parse(xhr.response));
      clearForm();
    }else{
      alert('Ocurrio un error');
    }
  }

  //funcion para indicar el tipo de peticion y la url a la que se realiza la peticion
  xhr.open('POST', 'http://localhost:3000/user' );
  //indica el tipo de informcion a enviar tipo mime
  xhr.setRequestHeader("Content-Type", "application/json");
  //convierte el objeto json 
  xhr.send(JSON.stringify(user));

}

//funcion para actualizar el usuario en la api
const updateUser = (user) =>{
  //Variables para usar ajax
  let xhr = new XMLHttpRequest(); 
  xhr.onload = () =>{
    if(xhr.status >= 200 && xhr.status < 400 ){
      let user = JSON.parse(xhr.response);
      console.log(user)
      $tableRow.querySelector('.register-table__name').textContent = user.firstName;
      $tableRow.querySelector('.register-table__id').textContent = user.id;
      $tableRow.querySelector('.register-table__lastname').textContent = user.lastName;
      $tableRow.querySelector('.register-table__email').textContent = user.email;
      $tableRow.querySelector('.register-table__phone').textContent = user.phone;
      $tableRow.querySelector('.register-table__address').textContent = user.address;
      $tableRow.querySelector('.register-table__update').setAttribute('data-id', user.id);
      $tableRow.querySelector('.register-table__delete').setAttribute('data-id', user.id);
      //clonando el template para no repetir informacion
      $tableBody.appendChild($fragment); 
      clearForm();
    }else{
      alert('Ocurrio un error');
    }
      
  };

  xhr.open('PUT',`http://localhost:3000/user/${user.id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(user));

}

//funcion para eliminar un usuario mediante ajax
const deleteUser = (component) =>{
  let xhr = new XMLHttpRequest(),
  id = component.getAttribute('data-id');
  xhr.onload = () =>{
    if(xhr.status >= 200 && xhr.status < 400){
      console.log($tableRow);
      $tableRow = component.parentNode.parentNode;
      //$tableRow.querySelector('.register-table__id').textContent = user.id;
      $tableRow.parentNode.removeChild($tableRow);
      alert('usuario eliminado');
    }
  };

  xhr.open('DELETE',`http://localhost:3000/user/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
}

//funcion para obtener un usuario por id
const getUserForId  = (id, callback) =>{
  let xhr = new XMLHttpRequest();
  xhr.onload = () =>{
    if(xhr.status >= 200 && xhr.status < 400){
        callback(xhr.response);
    }else{
      callback(xhr.response);
    }
  };
  
  xhr.open('GET',`http://localhost:3000/user/${id}`);
  xhr.send();
}


//funcion para obtener todos los usuarios del la API
const getAllUser = () =>{
  let xhr = new XMLHttpRequest();
  xhr.onload = () =>{
    if(xhr.status >= 200 && xhr.status < 400){
      showUserToTable(JSON.parse(xhr.responseText));
    }
  };

  xhr.open('GET', `http://localhost:3000/user`);
  xhr.send();
}

//metodo para capturar todos los click del documento
const listenEvenClick = () =>{

  $d.addEventListener('click', (e)=>{
  e.preventDefault();

  let formdata = new FormData($form),
  id = formdata.get('id');
  user = converFormdataToJson(formdata);
  componetParent = e.target.parentNode;
  switch(e.target.className){
      case  'container-form__send':createUser(user);
      break;
    case 'fa-solid fa-pencil':fillFieldsForm(componetParent.getAttribute('data-id'), componetParent);
      break;
    case 'container-form__update':updateUser(user);
      break;
    case'fa-regular fa-trash-can':deleteUser(componetParent);
      break;
    default:
      return;
  }

  });

}

listenEvenClick();  
getAllUser();
