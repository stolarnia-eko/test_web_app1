import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, serverTimestamp, setDoc, arrayUnion, collection, addDoc, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
//import { getDatabase, ref, set, push } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyC7MI_jaZfCZwGn8nzGEgDw60wjkA-Ivng",
  authDomain: "test-script-27e3c.firebaseapp.com",
  projectId: "test-script-27e3c",
  storageBucket: "test-script-27e3c.firebasestorage.app",
  messagingSenderId: "606340762693",
  appId: "1:606340762693:web:0a858eb6e6adb7dec8e72c",
  databaseURL: "https://test-script-27e3c-default-rtdb.firebaseio.com/",

  //firestoreURL: "https://firestore.googleapis.com/v1/projects/js-project-55157/databases/(default)/documents"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
//const db_realtime = getDatabase(app);
const db = getFirestore(app);

let category = ''

const buttons = document.querySelectorAll('.App-button');
buttons.forEach(button => {
  button.addEventListener('click', function () {
    dialog_add_recipe.style.display = 'block'
    // Находим родительскую карточку текущей кнопки
    const card = this.closest('.card');
    // Находим текст внутри карточки
    const cardText = card.querySelector('.header-bottom').textContent;
    // Выводим текст в консоль

    category = cardText;

  });
});

const dialog_add_recipe = document.getElementById('dialog')

const form = document.querySelector('form');
form.onsubmit = async (e) => {
  e.preventDefault();
  let name_recipe = form.input1.value;
  let text_recipe = form.input2.value;
  const userId = auth.currentUser.uid;
  if (name_recipe && text_recipe) {
    
    const newRecipe = {
      title: name_recipe,
      text: text_recipe,
      supportText:'Support Text',
      category: category
    };
    save_recipe_base(userId, newRecipe)
  }
  dialog_add_recipe.style.display = 'none'
}



// 1. Добавление документа с автоматически сгенерированным ID
async function save_recipe_base(userId, recipeData) {
  
  //----------//
  try {
    // Получаем ссылку на коллекцию /users/{userId}/recipes
    const recipesCollectionRef = collection(db, "users", userId, "recipes");

    // Добавляем новый документ в эту коллекцию с автоматическим ID
    const docRef = await addDoc(recipesCollectionRef, {
      ...recipeData,
      createdAt: serverTimestamp() // Добавляем метку времени создания на стороне сервера
    });

    console.log("Рецепт успешно добавлен с ID: ", docRef.id);
    return docRef.id; // Возвращает ID нового рецепта

  } catch (e) {
    console.error("Ошибка при добавлении документа: ", e);
    throw e; // Пробрасываем ошибку для дальнейшей обработки
  }
}





//----------//
// const userRef = doc(db, "users", userId);
// const docSnap = await getDoc(userRef);

// if (docSnap.exists()) {
//   const userDataObject = docSnap.data();
//   const categoryArray = userDataObject[category];
//   if (categoryArray) {
//     update(category, name_recipe, text_recipe, userId)
//   }
//   else {
//     save_data(category, name_recipe, text_recipe, userId)
//   }
// }
// else {
//   save_data(category, name_recipe, text_recipe, userId)
// }


async function save_data(category, name_recipe, text_recipe, userId) {
  const objectData = {
    [category]: [
      {
        "title": name_recipe,
        'text': text_recipe,
        'support': 'Support text'
      }
    ]
  }
  await setDoc(doc(db, "users", userId), objectData, { merge: true })


}
async function update(category, name_recipe, text_recipe, userId) {
  let newTag = {
    'title': name_recipe,
    'text': text_recipe,
    'support': 'Support text'
  }
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    [category]: arrayUnion(newTag)
  });
}

// 2. Добавление/установка документа с указанным ID (например, "LA")
async function addCityWithSpecificId() {
  await setDoc(doc(db, "cities", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  });
  console.log("Документ LA успешно записан.");
}
