import React, { useState } from "react";
import { db } from "./firebaseConfig/post";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "@firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  serverTimestamp,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  DocumentChange,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import {
  auth,
  googleProvider,
  login,
  logout,
  register,
  signInGoogle,
} from "./firebaseConfig/auth";

const addDate = async (): Promise<void> => {
  try {
    // コレクションとドキュメントの作成
    // addDocでデータを追加できる。
    // addDocの第一引数にはcollection関数、第二引数にはデータを渡す。
    // collection関数の第一引数にはdb、第二引数にはコレクション名を渡す
    // コレクションはfirestore上になければ作成される。
    // あればそのまま追加
    // docRef.idでドキュメントのIDが確認できる。
    // 同一のドキュメントIDを指定すればupdateすることが可能
    const docRef = await addDoc(collection(db, "users"), {
      first: "haro",
      middle: "mathison",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
const readData = async () => {
  // collectionの第二引数に対象のコレクションを選択
  // querySnapshotにコレクションが持つドキュメントをスナップショットで取得
  const querySnapshot = await getDocs(collection(db, "users"));
  // スナップショットは配列で入っている
  // doc.idでドキュメントidを、doc.data()でドキュメントが持つデータを確認できる。
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};

const refDoc = () => {
  // ドキュメント参照
  const alovelaceDocumentRef = doc(db, "users", "73luOGlE3mVU0HfQDIBr");
  // パス指定バージョン(上と同じ)
  const alovelaceDocumentRef2 = doc(db, "users/73luOGlE3mVU0HfQDIBr");
  console.log(alovelaceDocumentRef);
  console.log(alovelaceDocumentRef2);
};

const refCollection = () => {
  // コレクション参照
  const usersCollectionRef = collection(db, "a");
  console.log(usersCollectionRef);
};

function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [chat, setChat] = useState<DocumentData[]>([]);
  /**======================チャット用====================================== */

  const [input, setInput] = useState("");

  // コレクション取得
  const ref = collection(db, "chat");
  /**
   * set処理
   */
  const handleSet = async (input: string) => {
    console.log("set");
    /**
     * 1.db 2.col 3.doc
     */
    const docRef = doc(db, "cities", "LA");
    const data = {
      name: "Los Angeles",
      state: "CA",
      country: "Tokyo",
    };

    // setDocはデータの追加かつ上書き
    await setDoc(docRef, data);
  };

  /**
   * add処理
   */
  const handleAdd = async (input: string) => {
    console.log("add");
    /**
     * 1.db 2.col 3.doc
     */
    const colRef = collection(db, "cities");
    const data = {
      name: "Los Angeles",
      state: "CA",
      country: "Tokyo",
    };

    const result = await addDoc(colRef, data);
    console.log(result);
  };

  /**
   * handleCreatRefSetDoc処理
   */
  const handleCreatRefSetDoc = async (input: string) => {
    // Add a new document with a generated id
    const newCityRef = doc(collection(db, "cities"));
    const data = {
      name: "Los Angeles",
      state: "CA",
      country: "Tokyo",
    };
    console.log(newCityRef);
    // later...
    await setDoc(newCityRef, data);
    const data2 = {
      name: "亀田Los Angeles",
      state: "CA",
      country: "Tokyo",
    };
    await setDoc(newCityRef, data2);
  };

  /**
   * handleUpdate処理
   */
  const handleUpdate = async (input: string) => {
    // Add a new document with a generated id
    const newCityRef = doc(collection(db, "cities"));
    const data = {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    };
    await setDoc(newCityRef, data);
    await updateDoc(newCityRef, {
      country: "tokyo",
    });
  };

  /**
   * handleNestUpdate処理
   */
  const handleNestUpdate = async (input: string) => {
    // Add a new document with a generated id
    const newUserRef = doc(collection(db, "users"));
    const data = {
      name: "Frank",
      favorites: { food: "Pizza", color: "Blue", subject: "recess" },
      age: 12,
    };
    await setDoc(newUserRef, data);
    await updateDoc(newUserRef, {
      age: 13,
      "favorites.color": "Red",
    });
  };

  /**
   * handleTimeStamp処理
   */
  const handleTimestamp = async (input: string) => {
    const newCityRef = doc(collection(db, "cities"));
    const data = {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    };
    await setDoc(newCityRef, data);
    await updateDoc(newCityRef, {
      timestamp: serverTimestamp(),
    });
  };

  // クエリ作成
  const q = query(ref, orderBy("input", "desc"));
  onSnapshot(q, (snapshot) => {
    const data = snapshot.docChanges().map((change) => change.doc.data());
    setChat(data);
  });

  // useEffectに似ている効果を持つ
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#a8dadc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* one */}
      <div
        style={{
          width: "800px",
          height: "auto",
          backgroundColor: "#457b9d",
          display: "flex",
          alignItems: "start",
          borderRadius: "10px",
          padding: "10px",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <button style={{ width: "130px" }} onClick={addDate}>
          データ追加
        </button>
        <button style={{ width: "130px", marginTop: "5px" }} onClick={readData}>
          データ読み取り
        </button>
        <button style={{ width: "130px", marginTop: "5px" }} onClick={refDoc}>
          ドキュメント参照
        </button>
        <button
          style={{ width: "130px", marginTop: "5px" }}
          onClick={refCollection}
        >
          コレクション参照
        </button>
        <div>
          <h3>ユーザ登録</h3>
          <input
            placeholder="Email"
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <input
            placeholder="Email"
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button onClick={() => register(registerEmail, registerPassword)}>
            登録
          </button>
        </div>
        <div>
          <h3>ログイン</h3>
          <input
            placeholder="Email"
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            placeholder="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={() => login(loginEmail, loginPassword)}>
            ログイン
          </button>
        </div>
        <h3>Gmailログイン</h3>
        <button onClick={signInGoogle}>Gログイン</button>
        <h3>現在ログインしているユーザ</h3>
        {user?.email}
        <button onClick={logout}>サインアウト</button>
      </div>
      {/* two */}
      <div
        style={{
          width: "800px",
          height: "auto",
          backgroundColor: "#8ca547",
          display: "flex",
          alignItems: "start",
          borderRadius: "10px",
          padding: "10px",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <input onChange={(e) => setInput(e.target.value)} />
        <button onClick={() => handleSet(input)}>set処理</button>
        <button onClick={() => handleAdd(input)}>add処理</button>
        <button onClick={() => handleCreatRefSetDoc(input)}>
          Ref作成後にsetDoc
        </button>
        <button onClick={() => handleUpdate(input)}>update処理</button>
        <button onClick={() => handleNestUpdate(input)}>
          ネストupdate処理
        </button>
        <button onClick={() => handleTimestamp(input)}>timeStamp処理</button>
      </div>
    </div>
  );
}

export default App;
