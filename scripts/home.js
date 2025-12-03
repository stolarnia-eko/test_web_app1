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
const select = document.getElementById('select')


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        userId = uid;
        create_list_recipe(userId)
        document.getElementById('user').innerText = user.email;
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

        const box_left = document.createElement('div')
        const p_title = document.createElement('p');
        p_title.innerText = data_recipe.title;
        p_title.classList.add('name-recipe')
        const p_support = document.createElement('p');
        p_support.innerText = data_recipe.supportText;
        p_support.classList.add('support-recipe')

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
        img2.addEventListener('click', (e)=>{
            e.stopPropagation()
            click_edit(p_title.innerText)
        })
        img1.addEventListener('click', (e)=>{
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
    else{
        data_from_category(selectedValue).then(data=>{
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
async function click_list_item(name_recipe) {
    document.getElementById('dialog-recipe').style.display = 'flex';
    container.innerHTML = '';

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
    let text_start_edit = document.getElementById('block-text-recipe').innerText;
    if (bool_btn_edit) {
        document.getElementById('block-text-recipe').style.display = 'none'
        document.getElementById('text-recipe').value = text_start_edit;
        document.getElementById('text-recipe').style.display = 'block';
        bool_btn_edit = false;
    }
    else {
        update_text_recipe(text_start_edit)
        bool_btn_edit = true;
        document.getElementById('block-text-recipe').style.display = 'block'
        document.getElementById('text-recipe').style.display = 'none';
    }

})
// close screen get text recipe
document.getElementById('close-dialog-recipe').addEventListener('click', (e) => {
    document.getElementById('dialog-recipe').style.display = 'none'
    document.getElementById('text-recipe').style.display = 'none';
    document.getElementById('block-text-recipe').style.display = 'block';
    select.value = 'Wszystkie przepisy';
    create_list_recipe()
})
//update text recipe
async function update_text_recipe(text_start_edit) {
    let newText = document.getElementById('text-recipe').value;
    document.getElementById('block-text-recipe').innerText = newText;
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
        // 2. Вызываем функцию updateDoc() для изменения данных
        await updateDoc(recipeDocRef, {
            text: newText // Объект, указывающий, какие поля обновить
        });


        document.getElementById('text-messenger').innerText = 'Tresc przepisu zmieniono'
        setTimeout(() => {
            sayHello();
        }, 2000);

    } catch (error) {
        console.error("Ошибка при обновлении поля 'text':", error);
        // Обработайте ошибку, например, покажите уведомление пользователю
    }


}
function sayHello(params) {
    document.getElementById('text-messenger').innerText = '';
    document.getElementById('info').innerText = ''
}

// click item list recipe -------- Finish---------

// delete recipe
function click_img_delete(name_recipe) {
    document.getElementById('dialog').style.display = 'flex';
    document.getElementById('recipe').innerText = name_recipe;

}

document.getElementById('btn-close').addEventListener('click', (e) => {
    document.getElementById('dialog').style.display = 'none';

});
document.getElementById('btn-yes').addEventListener('click', (e) => {
    document.getElementById('dialog').style.display = 'none';
    delete_recipe()
    // тут видаляэмо рецепт
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
        // 2. Вызываем функцию deleteDoc()
        await deleteDoc(recipeDocRef);
        setTimeout(() => {
            sayHello();
        }, 2000);
        document.getElementById('info').innerText = 'Przepis wykasowano!!!'
        const delete_object = document.getElementById(recipeId)
        if (delete_object){
            container.removeChild(delete_object)
        }
    } catch (error) {
        console.error("Ошибка при удалении рецепта:", error);
        // Обработайте ошибку, например, покажите уведомление пользователю
        throw error;
    }

}
// click edit start
function click_edit(name_recipe) {
    localStorage.setItem('name_recipe', name_recipe)
    document.getElementById('dialod-edit-support').style.display = 'flex'
    
}
document.getElementById('btn-edit-support').addEventListener('click', e => {
    document.getElementById('dialod-edit-support').style.display = 'none'
    update_text_support()
})

async function update_text_support(params) {
    const name_recipe = localStorage.getItem('name_recipe');
    const newSupportText = document.getElementById('text-support').value;
    
    const recipesCollectionRef = collection(db, "users", userId, "recipes");
    const q = query(recipesCollectionRef, where("title", "==", name_recipe));

    const querySnapshot = await getDocs(q);
    const recipeIds = [];

    querySnapshot.forEach((doc) => {
        recipeIds.push(doc.id);
    });

    const recipeId = recipeIds[0]
    const recipeDocRef = doc(db, "users", userId, "recipes", recipeId);
    
    if (newSupportText === ''){
        return
    }
    try {
        // 2. Вызываем функцию updateDoc() для изменения данных
        await updateDoc(recipeDocRef, {
            supportText: newSupportText // Объект, указывающий, какие поля обновить
        });
        document.getElementById(recipeId).children[0].children[1].innerText = newSupportText;
        
        

    } catch (error) {
        console.error("Ошибка при обновлении поля 'text':", error);
        // Обработайте ошибку, например, покажите уведомление пользователю
    }
    document.getElementById('text-support').value = ''
}

// add recipe
document.getElementById('click_add-recipe').addEventListener('click', (e) => {
    select.value = 'Wszystkie przepisy'
    window.location.href = './add_recipe.html'
    console.log('click add recipe')
})
