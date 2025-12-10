import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, updateDoc, query, where, getDocs, deleteDoc, doc, collection } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyC7MI_jaZfCZwGn8nzGEgDw60wjkA-Ivng",
    authDomain: "test-script-27e3c.firebaseapp.com",
    projectId: "test-script-27e3c",
    storageBucket: "test-script-27e3c.firebasestorage.app",
    messagingSenderId: "606340762693",
    appId: "1:606340762693:web:0a858eb6e6adb7dec8e72c",
    //databaseURL: "https://js-project-55157-default-rtdb.firebaseio.com/",
    //firestoreURL: "https://firestore.googleapis.com/v1/projects/js-project-55157/databases/(default)/documents"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userId = '';
const container = document.getElementById('list-recipe');
container.style.padding = ' 20px 10px';
const select = document.getElementById('select')


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        userId = uid;
        create_list_recipe(userId)
        document.getElementById('user').innerText = user.displayName;
        
    } else {
    }
});


async function getData() {
    const recipesArray = [];
    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const querySnapshot = await getDocs(recipesCollectionRef);

    querySnapshot.forEach((doc) => {
        // doc.data() возвращает поля документа как объект JS
        const recipeData = doc.data();
        // Добавляем данные в массив, опционально включая ID документа
        recipesArray.push({
            id: doc.id, // ID документа Firestore (полезно для обновлений/удалений)
            ...recipeData // Остальные данные (title, text, category, createdAt)
        });
    });
    return recipesArray;
}
// click dot vertical
const div_dot = document.getElementById('div-dot')
document.getElementById('dot-vertical').addEventListener('click', e => {
    
    if (div_dot.classList.contains('show')){
        div_dot.classList.remove('show')
    }
    else{
        div_dot.classList.add('show')
    }
})
const all_list = document.querySelector('ul').children;

for (let index = 0; index < all_list.length; index++) {
    const element = all_list[index];
    element.addEventListener('click', e=>{
       div_dot.classList.remove('show') 
    })
    
}

function create_list_recipe() {
    getData().then(data => {
        create_box_list_recipe(data)
    });
};

function create_box_list_recipe(data) {
    for (let index = 0; index < data.length; index++) {
        const data_recipe = data[index];
        const div_list = document.createElement('div');
        div_list.id = data_recipe.id;
        div_list.classList.add('list_item')


        const box_left = document.createElement('div');
        const p_title = document.createElement('p');
        p_title.innerText = data_recipe.title;
        p_title.classList.add('name-recipe')
        p_title.style.margin = 0;
        const p_support = document.createElement('p');
        p_support.innerText = data_recipe.supportText;
        p_support.classList.add('support-recipe')
        p_support.style.margin = 0;


        const box_right = document.createElement('div')
        box_right.classList.add('box-right')
        const img1 = document.createElement('img');
        img1.src = '../assets/icons/icons8-delete-48.png';
        img1.classList.add('img_delete')
        const img2 = document.createElement('img');
        img2.src = '../assets/icons/free-icon-pencil-1046346.png';
        img2.classList.add('img_edit')

        box_left.appendChild(p_title)
        box_left.appendChild(p_support);
        box_right.appendChild(img2);
        box_right.appendChild(img1);
        div_list.appendChild(box_left);
        div_list.appendChild(box_right)

        div_list.addEventListener('click', (e) => {
            e.stopPropagation()
            click_list_item(p_title.innerText);

        })
        img2.addEventListener('click', (e) => {
            e.stopPropagation()
            click_edit(p_title.innerText)
        })
        img1.addEventListener('click', (e) => {
            e.stopPropagation()
            click_img_delete(p_title.innerText)
        })
        container.appendChild(div_list);

    }
}
// select category ------ Start---------
document.querySelector('select').addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    container.innerHTML = ''
    if (select.value === 'Wszystkie przepisy') {
        create_list_recipe()
        return;
    }
    else {
        data_from_category(selectedValue).then(data => {
            create_box_list_recipe(data)
        })
    }


})
async function data_from_category(category) {
    const list_recipe_category = []
    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const recipeData = doc.data();

        list_recipe_category.push({
            id: doc.id,
            ...recipeData
        });
    })
    return list_recipe_category;
}
// select category ------ Finish---------

// click item list recipe -------- Start---------
const dialog_text_recipe = document.getElementById('dialog-text-recipe')
async function click_list_item(name_recipe) {
    dialog_text_recipe.showModal()
    // document.getElementById('dialog-recipe').style.display = 'flex';
    // container.innerHTML = '';

    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("title", "==", name_recipe));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        getTextRecipe(recipeData.text)
        document.getElementById('name-recipe').innerText = name_recipe;
    })
}

function getTextRecipe(text_recipe) {
    document.getElementById('block-text-recipe').innerText = text_recipe;

}
let bool_btn_edit = true;
document.getElementById('edit-recipe').addEventListener('click', (e) => {
    let list_text = []
    list_text.push(document.getElementById('block-text-recipe').innerText)
    if (bool_btn_edit) {
        document.getElementById('box-recipe-text').style.display = 'none'
        document.getElementById('box-recipe-edit').value = document.getElementById('block-text-recipe').innerText;
        document.getElementById('box-recipe-edit').style.display = 'block';
        bool_btn_edit = false;
    }
    else {

        bool_btn_edit = true;
        document.getElementById('box-recipe-text').style.display = 'block'
        document.getElementById('box-recipe-edit').style.display = 'none';
        list_text.push(document.getElementById('box-recipe-edit').value)
        // update_text_recipe1(list_text)
        if (list_text[0].replace(/\s+/g, '') === list_text[1].replace(/\s+/g, '')) {
            dialog_text_recipe.close();

        }
        else {
            update_text_recipe(list_text)
        }
    }


})
function update_text_recipe1(list_text) {
    console.log('update')
    // if (list_text[0].replace(/\s+/g, '') === list_text[1].replace(/\s+/g, '')) {
    //     dialog_text_recipe.close();

    // }
    // else {
    //     console.log('update')
    // }
}
// close screen get text recipe
document.getElementById('close-dialog-recipe').addEventListener('click', (e) => {
    dialog_text_recipe.close()
    select.value = 'Wszystkie przepisy';
    create_list_recipe()
})
//update text recipe
async function update_text_recipe(text_edit) {
    document.getElementById('block-text-recipe').innerText = text_edit[1];
    const name_recipe = document.getElementById('name-recipe').innerText;

    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("title", "==", name_recipe));

    const querySnapshot = await getDocs(q);
    const recipeIds = [];

    querySnapshot.forEach((doc) => {
        recipeIds.push(doc.id);
    });

    const recipeId = recipeIds[0]
    const recipeDocRef = doc(db, "users", userId, "recipes", recipeId);


    try {

        await updateDoc(recipeDocRef, {
            text: text_edit[1]
        });


        document.getElementById('text-messenger').innerText = 'Tresc przepisu zmieniono'
        setTimeout(() => {
            sayHello();
        }, 2000);

    } catch (error) {
        console.error("Ошибка при обновлении поля 'text':", error);
    }


}
function sayHello(params) {
    document.getElementById('text-messenger').innerText = '';
    document.getElementById('info').style.display = 'none'
}

// click item list recipe -------- Finish---------

// delete recipe
const dialog_delete = document.getElementById('delete-dialog');
function click_img_delete(name_recipe) {
    document.getElementById('recipe').innerText = name_recipe;
    dialog_delete.showModal()
}

document.getElementById('btn-close').addEventListener('click', (e) => {
    dialog_delete.close();
});
document.getElementById('btn-yes').addEventListener('click', (e) => {
    dialog_delete.close();
    delete_recipe()
})

async function delete_recipe() {
    const name_recipe = document.getElementById('recipe').innerText;
    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("title", "==", name_recipe));

    const querySnapshot = await getDocs(q);
    const recipeIds = [];
    querySnapshot.forEach((doc) => {
        recipeIds.push(doc.id);
    });
    const recipeId = recipeIds[0]
    const recipeDocRef = doc(db, "users", userId, "recipes", recipeId);
    try {
        await deleteDoc(recipeDocRef);
        setTimeout(() => {
            sayHello();
        }, 2000);
        document.getElementById('info').style.display = 'block'
        document.getElementById('info').innerText = 'Przepis wykasowano!!!'
        const delete_object = document.getElementById(recipeId)
        if (delete_object) {
            container.removeChild(delete_object)

        }
    } catch (error) {
        console.error("Ошибка при удалении рецепта:", error);
        throw error;
    }

}
// click edit start

const dialog_edit = document.getElementById('edit-support-dialog')
function click_edit(name_recipe) {
    localStorage.setItem('name_recipe', name_recipe)
    dialog_edit.showModal()
}
document.getElementById('btn-edit-support').addEventListener('click', e => {
    const newSupportText = document.getElementById('text-support').value;
    if (newSupportText === '') {
        dialog_edit.close();
        return
    }
    update_text_support(newSupportText);
    dialog_edit.close()
})

async function update_text_support(newTextSupport) {
    const name_recipe = localStorage.getItem('name_recipe');

    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("title", "==", name_recipe));

    const querySnapshot = await getDocs(q);
    const recipeIds = [];

    querySnapshot.forEach((doc) => {
        recipeIds.push(doc.id);
    });

    const recipeId = recipeIds[0]
    const recipeDocRef = doc(db, "users", userId, "recipes", recipeId);

    try {
        // 2. Вызываем функцию updateDoc() для изменения данных
        await updateDoc(recipeDocRef, {
            supportText: newTextSupport
        });
        document.getElementById(recipeId).children[0].children[1].innerText = newTextSupport;

    } catch (error) {
        console.error("Ошибка при обновлении поля 'text':", error);
        // Обработайте ошибку, например, покажите уведомление пользователю
    }
    document.getElementById('text-support').value = ''
}

