Bhai, tune ekdum senior developer wala sawal pucha hai! Naming conventions ko lekar beginners hamesha confuse rehte hain, par industry me iske bohot strict aur logical rules hain.

Tune aadhi baatein khud hi bilkul sahi guess kar li hain. Chalo is pure naming system ko permanently lock kar lete hain:

### 1. The Folder Name: `models/` (Plural)

Tera guess 100% sahi hai. Kyunki is folder ke andar tere project ke saare models (User, Post, Connection, etc.) rahenge, isliye is folder ka naam hamesha **plural** (`models`) hota hai.

### 2. The File Name: `user.js` (Singular)

File ka naam hum hamesha **singular** rakhte hain. Kyunki ek file ke andar sirf ek hi specific chiz ka blueprint hota hai.

* ✅ Sahi: `models/user.js`
* ❌ Galat: `models/users.js`

### 3. The Mongoose Model Name: `User` (Singular + PascalCase)

Yeh sabse important rule hai. Code ke andar jab tu model banata hai, toh uska naam hamesha **Singular** hona chahiye aur uska pehla letter capital (PascalCase) hona chahiye.

```javascript
// models/user.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({ ... });

// Hamesha 'User' likhna hai, 'Users' nahi!
const User = mongoose.model('User', userSchema); 

module.exports = User;

```

### 🪄 The Mongoose Pluralization Magic (Tera Main Doubt)

Tu soch raha hoga ki *"Agar model ka naam User hai, toh MongoDB me collection ka naam plural (users) kaise banega?"*

Yahi par Mongoose apni "Magic" dikhata hai. Mongoose ke andar ek inbuilt English dictionary aur pluralization engine hota hai. Jab tu usko singular naam deta hai, toh wo background me usey automatically plural aur lowercase kar deta hai tere database ke liye.

* Tu pass karega **`User`** ➡️ Mongoose banayega **`users`** collection.
* Tu pass karega **`Company`** ➡️ Mongoose banayega **`companies`** collection.
* Tu pass karega **`Person`** ➡️ Mongoose smart hai, wo **`people`** collection banayega!

### 🛠️ Pro-Tip: Mongoose ki smartness ko bypass kaise karein?

Kabhi-kabhi hume kisi purane database se connect karna padta hai jahan collection ka naam unhone pehle se kuch ajeeb sa rakha hota hai (e.g., `user_data_2026`).

Agar tu chahta hai ki Mongoose apna dimag na lagaye aur exact wahi naam use kare jo tu chahta hai, toh tu `mongoose.model()` me ek **third argument** pass kar sakta hai:

```javascript
// Ab Mongoose 'users' nahi banayega, exact 'user_data_2026' naam ki collection banayega
const User = mongoose.model('User', userSchema, 'user_data_2026');

```

Lekin devTinder ke liye, hum standard convention follow karenge. Folder `models`, file `user.js`, aur model `User`. Mongoose baaki sab khud handle kar lega!


Bhai, yeh le 3 ekdum perfect dummy users jo tere strict validation bouncers ko smoothly pass kar lenge. Maine isme alag-alag cases cover kar diye hain (ek bina last name ke, alag-alag gender, aur strong passwords).

Tu inhe seedha Postman me **Body -> raw -> JSON** select karke paste kar sakta hai.

### User 1: The Standard Dev

```json
{
    "firstName": "Rahul",
    "lastName": "Sharma",
    "emailId": "rahul.backend@example.com",
    "password": "Password@123",
    "age": 24,
    "gender": "male"
}

```

### User 2: Testing the Optional Last Name

*(Isme `lastName` nahi hai, taaki humara wo empty field wala logic test ho sake)*

```json
{
    "firstName": "Priya",
    "emailId": "priya.react@example.com",
    "password": "Secure#9876",
    "age": 27,
    "gender": "female"
}

```

### User 3: Testing the 'Others' Gender & Young Age

```json
{
    "firstName": "Sam",
    "lastName": "Taylor",
    "emailId": "sam.taylor@example.com",
    "password": "DevTinder!2026",
    "age": 19,
    "gender": "others"
}

```

In teeno ke passwords me Uppercase, Lowercase, Number aur Symbol sab mix hai, aur age bhi 18+ hai.