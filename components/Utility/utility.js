import * as firebase from 'firebase'
import 'firebase/firestore'
import { GoogleSignin } from '@react-native-community/google-signin';
import { getSimilarity } from './recommendation'

const firebaseConfig = {
    apiKey: "AIzaSyCvB_R-hXjBgxr4FGfEcRcaZ9u8mWO2UeE",
    authDomain: "fixx-25c1c.firebaseapp.com",
    databaseURL: "https://fixx-25c1c.firebaseio.com",
    projectId: "fixx-25c1c",
    storageBucket: "fixx-25c1c.appspot.com",
    messagingSenderId: "1046312836049",
    appId: "1:1046312836049:web:186b34ee0a4cf0cff9def0",
    measurementId: "G-EQBJ33PVS8"
};
if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '1046312836049-mb616nc7ktkuj9ghb34f1fbqslvinmi0.apps.googleusercontent.com',
    offlineAccess: true
});

export async function signup(email, password, name) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        var user = firebase.auth().currentUser;
        user.updateProfile({ displayName: name })
    }).catch((error) => {
        throw error
    })
}

export async function logout() {
    firebase.auth().signOut().then(function () {
        console.log('Logout Successful')
    }).catch(function (error) {
        console.log('Logout Unsuccessful')
    });
}

export async function login(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        console.log("Login Successful")
    }).catch(error => {
        throw error;
    })
}

export async function resetPassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        console.log("Email has been sent to you")
    }).catch((error) => {
        throw error
    })
}

export async function emailVerification() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        console.log('Email verified = ', user.emailVerified)
    }).catch(error => {
        console.log(error.message)
    });
}

export async function isUserVerified() {
    var user = firebase.auth().currentUser;
    console.log(user.emailVerified)
    if (user) {
        return user.emailVerified
    } else {
        return false
    }

}

export async function changePassword(oldPassword, newPassword) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
    );
    // Now you can use that to reauthenticate
    await user.reauthenticateWithCredential(credential).then(async () => {
        await user.updatePassword(newPassword).then(function () {
            console.log('password changed successfully')
        }).catch(error => console.log('changePassUtitlity ', error.message));
    }).catch(error => console.log('reauth ', error.message));
}

export async function getUserFirestoreObj() {
    const uid = await getCurrentUid();
    let userObj = null;
    await firebase.firestore().collection('Users').where('userID', '==', uid).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().userID == uid) {
                userObj = [doc.id, doc.data()];
            }
        })
    }).catch(error => { return null })
    return userObj
}

export async function setUserFirestoreObj(obj) {
    await getCurrentUid().then(async uid => {
        obj.uid = uid
        await firebase.firestore().collection('Users').doc().set(obj).then(() => console.log('done'))
    }).catch(err => { throw err })
}

export async function getFirestoreUserByUid(uid) {
    let userObj = null;
    await firebase.firestore().collection('Users').where('userID', '==', uid).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().userID == uid) {
                userObj = [doc.id, doc.data()];
            }
        })
    }).catch(error => { return null })
    return userObj
}

export async function getFirestoreUserByEmail(email) {
    let userObj = null;
    await firebase.firestore().collection('Users').where('email', '==', email).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            userObj = { docID: doc.id, docData: doc.data() }
        })
    }).catch(error => { return null })
    return userObj
}

export async function addStore(storeObj) {
    let storeRef;
    await firebase.firestore().collection('Stores').add(storeObj).then(ref => {
        storeRef = ref.id
    }).catch(err => { return null })
    return storeRef
}

export async function setStore(storeRef, storeObj) {
    await firebase.firestore().collection('Stores').doc(storeRef).set(storeObj).catch(err => { throw err })
}



export async function getWishlistUsers(adID) {
    let adObj = [];
    await firebase.firestore().collection('Wishlist').where('adID', '==', adID).get().then(snapshot => {
        snapshot.docs.forEach(doc => adObj.push([doc.id, doc.data()]))
    }).catch(error => { return err })
    return adObj
}

export async function isWishlisted(uid, adID) {
    let flag = false;
    await firebase.firestore().collection('Wishlist')
        .where('userID', '==', uid)
        .where('adID', '==', adID)
        .get().then(snapshot => {
        if (!snapshot.empty)
            flag = true
    }).catch(error => { console.log(error.message); return false })
    return flag
}

export async function getAllUsers(updateParent) {
    let users = []
    await firebase.firestore().collection('Users').get().then(snapshot => {
        if (snapshot.empty)
            return
        snapshot.docs.forEach(doc => {
            users.push({ docID: doc.id, docData: doc.data() })
            updateParent(users)
        })
    }).catch(err => { throw err })
}



export async function getCurrentUserObj() {
    userObj = await firebase.auth().currentUser;
    if (userObj) {
        return userObj
    }
    return null
}

async function uriToBlob(uri) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            // something went wrong
            reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

async function getStoreImageUrl(outletId, imageName) {
    var storageRef = firebase.storage().ref();
    var pathRef = storageRef.child("Stores").child(outletId + '/' + imageName);
    let url = await pathRef.getDownloadURL()
    return url;
}

export async function uploadStoreImages(response, outletId) {
    let file = await uriToBlob(response.uri)
    const storageRef = firebase.storage().ref().child("Stores").child(outletId + '/' + response.fileName);
    await storageRef.put(file)
    let url = await getStoreImageUrl(outletId, response.fileName)
    return url
}

async function getAdDownloadUrl(category, uid, adId, imageName) {
    var storageRef = firebase.storage().ref();
    var pathRef = storageRef.child(category).child(uid).child(adId + '/' + imageName);
    let url = await pathRef.getDownloadURL()
    return url;
}

export async function uploadAdImage(response, category, uid, adId) {
    let file = await uriToBlob(response.uri)
    const storageRef = firebase.storage().ref().child(category).child(uid).child(adId + '/' + response.fileName);
    await storageRef.put(file)
    let url = await getAdDownloadUrl(category, uid, adId, response.fileName)
    return url
}

export async function deleteAdImage(url) {
    const storageRef = firebase.storage().refFromURL(url)
    await storageRef.delete()
}

export async function uploadProfilePhoto(response, uid) {
    let file = await uriToBlob(response.uri)
    const storageRef = firebase.storage().ref().child('ProfilePhotos').child(uid + '/' + response.fileName)
    await storageRef.put(file)
    let url = await storageRef.getDownloadURL()
    return url
}

export async function uploadBroadcastImage(response, uid) {
    let file = await uriToBlob(response.uri)
    const storageRef = firebase.storage().ref().child('Broadcasts').child(uid + '/' + response.fileName)
    await storageRef.put(file)
    let url = await storageRef.getDownloadURL()
    return url
}

async function getOutletsByCategory(category) {
    let outlets = []
    await firebase.firestore().collection('Stores').where('category', '==', category).get().then(snapshots => {
        snapshots.docs.forEach(doc => {
            outlets.push({ docID: doc.id, docData: doc.data() })
        })
    })
    return outlets
}

export async function sendBroadcast(obj) {
    await getCurrentUid().then(async uid => {
        await getOutletsByCategory(obj.category).then(async outlets => {
            await uploadBroadcastImage(obj.photoURL, uid).then(async url => {
                outlets.forEach(async o => {
                    let temp = obj
                    temp.userID = uid
                    temp.storeID = o.docID
                    temp.photoURL = url
                    console.log(temp)
                    await firebase.firestore().collection('Broadcasts').doc().set(temp)
                })
            })
        })
    }).catch(err => { throw err })
}

export async function getData(collection, doc, objectKey) {
    // check if data exists on the given path
    if (objectKey === undefined) {
        return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
            if (doc.exists) {
                return doc.data();
            } else {
                return false;
            }
        })
    }
    else {
        return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
            if (doc.exists && (doc.data()[objectKey] != undefined)) {
                return (doc.data()[objectKey]);
            } else {
                return false;
            }
        })
    }
}

export async function addToArray(collection, doc, array, value) {
    let docRef = await firebase.firestore().collection(collection).doc(doc);
    let docData = await docRef.get();
    if (docData.exists && (docData.data()[array] != undefined)) {
        docRef.update({
            [array]: firebase.firestore.FieldValue.arrayUnion(value)
        });
    }
    else {
        saveData(collection, doc, { [array]: [value] });
    }
}

export async function saveData(collection, doc, jsonObject) {
    await firebase.firestore().collection(collection).doc(doc).set(jsonObject, { merge: true }).catch(function (error) {
        console.error("Error writing document: ", error);
    });
}

export async function getAllChats(userID) {
    let chats;
    await firebase.firestore().collection('Chats').doc(userID).get().then(doc => {
        if (doc.exists)
            chats = doc.data()
        else
            chats = null
    }).catch(err => { throw err })
    return chats
}

export async function getOutlet(marketeerID) {
    let outlet;
    await firebase.firestore().collection('Stores').where('marketeerID', '==', marketeerID).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            outlet = { docID: doc.id, docData: doc.data() }
            return
        })
    }).catch(err => { throw err })
    return outlet
}

export async function getOutletAds(outletID, updateCaller) {
    let ads = [];
    await firebase.firestore().collection('Ads').where('outletID', '==', outletID).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            ads.push({ docID: doc.id, docData: doc.data() })
            updateCaller(ads)
        })
    }).catch(err => { throw err })
}

export async function getAllAds(updateCaller) {
    let ads = []
    await firebase.firestore().collection('Ads').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let temp = doc.data()
            temp.docID = doc.id
            ads.push(temp)
            updateCaller(ads)
        })
    }).catch(err => { throw err })
}

export async function getDashboardAds() {
    let arr = []
    await firebase.firestore().collection('Ads').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            arr.push({ docID: doc.id, docData: doc.data() })
        })
    }).catch(err => { throw err })
    return arr
}

export async function getOrderdAds() {
    let arr = []
    await firebase.firestore().collection('Orders').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            arr.push({ docID: doc.id, docData: doc.data() })
        })
    }).catch(err => { throw err })
    return arr
}

export async function setHotAd(adID, data) {
    await firebase.firestore().collection('Hot Ads').doc(adID).set(data).catch(err => { 
        console.log(err)
        throw err 
    })
}



export async function getHotAd(adID) {
    let obj;
    await firebase.firestore().collection('Hot Ads').doc(adID).get().then(doc => {
        if (doc.exists)
            obj = doc.data()
    }).catch(err => {throw err})
    return obj
}

export async function updateHotAd(adID, obj){   
    await firebase.firestore().collection('Hot Ads').doc(adID).update(obj).catch(err => { 
        console.log(err)
        throw err 
    })
}

export async function getCurrentUid() {
    const userId = await firebase.auth().currentUser.uid;
    if (userId)
        return userId
    else
        return await GoogleSignin.getCurrentUser().uid;
}

export async function getStore(uid) {
    let storeObj;
    await firebase.firestore().collection('Stores').where('marketeerID', '==', uid).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            storeObj = { docID: doc.id, docData: doc.data() }
        })
    }).catch(err => { return null })
    return storeObj
}

export async function updateStore(storeRef, storeObj) {
    await firebase.firestore().collection('Stores').doc(storeRef).update(storeObj).catch(err => { throw err })
}

export async function getAds(storeID, updateParent) {
    await firebase.firestore().collection('Ads').where('outletID', '==', storeID).get().then(snapshot => {
        if (snapshot.empty)
            return
        let arr = []
        snapshot.docs.forEach(doc => {
            arr.push({ docID: doc.id, docData: doc.data() })
            updateParent(arr)
        })
    }).catch(err => { throw err })
}

export async function addOrder(orderObj) {
    let orderRef;
    await firebase.firestore().collection('Orders').add(orderObj).then(ref => {
        orderRef = ref.id
    }).catch(err => { throw err })
    return orderRef
}

export async function getOrders(storeID) {
    let obj = { list: [], profit: 0, orders: 0 }
    await firebase.firestore().collection('Orders').where('storeID', '==', storeID).get().then(snapshot => {
        if (snapshot.empty)
            return
        else {
            snapshot.docs.forEach(doc => {
                let temp = doc.data()
                temp.timestamp = temp.timestamp.toDate()
                temp.timestamp = new Date(temp.timestamp)
                obj.list.push({ docID: doc.id, docData: temp })
                obj.profit += temp.profit
                obj.orders += 1
            })
        }
    }).catch(err => { throw err })
    return obj
}

export async function getBroadcasts(storeID, updateParent) {
    let arr = []
    await firebase.firestore().collection('Broadcasts').where('storeID', '==', storeID).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            arr.push({ docID: doc.id, docData: doc.data() })
            updateParent(arr)
        })
    }).catch(err => { throw err })
}

export async function getHotAds(id, obj) {
    let hotObj;
    await firebase.firestore().collection('Hot Ads').doc(id).get().then(doc => {
        if (doc.exists)
            hotObj = { docID: id, docData: obj }
    }).catch(err => { throw err })
    return hotObj
}

export async function getRecommendedAds(adID, adObj, category, type) {
    let arr = []
    await firebase.firestore().collection('Ads').where('Category', '==', category)
    .where("Type", '==', type).limit(10).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.id != adID) {
                let sim = getSimilarity(adObj, doc.data(), category)
                console.log(sim)
                if (sim >= 0.95) {
                    console.log('Match')
                    arr.push({ docID: id, docData: doc.data() })
                }
            }
        })
    }).catch(err => { throw err })
    return arr
}