import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

function App() {
  const [pointsEarned, setPointsEarned] = useState(0);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setPointsEarned(docSnapshot.data().points || 0);
            setUsername(docSnapshot.data().username || "User");
          }
        });
        return unsubscribeDoc;
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { username, points: 0 });
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const generateInviteLink = () => {
    if (user) {
      setInviteLink(`${window.location.origin}/ref/${user.uid}`);
    } else {
      alert("Please log in to generate an invite link!");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const offerWalls = [
    { name: "AdGate Media", logo: "https://via.placeholder.com/150?text=AdGate" },
    { name: "Adscend Media", logo: "https://via.placeholder.com/150?text=Adscend" },
    { name: "Lootably", logo: "https://via.placeholder.com/150?text=Lootably" },
  ];

  const socialMediaTasks = [
    {
      platform: "Facebook",
      icon: "https://via.placeholder.com/40?text=FB",
      tasks: [
        { name: "subscribe to youtube channel", url: "https://www.youtube.com/@ThriveMode247" },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex flex-col md:flex-row h-full">
        <aside className="bg-black text-white w-full md:w-64 p-2 flex flex-col">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl mt-2 md:mt-6 mx-auto md:text-4xl font-bold">Gain Sphere</h1>
          </div>
          <nav className="flex-grow hidden mt-6 md:block ">
            <ul className="space-y-2 ">
              <li className="text-yellow-500 font-semibold ml-3">Coming Soon</li>
              <li className="hover:bg-yellow-500  px-3 py-2 rounded-lg ">Surveys</li>
              <li className="hover:bg-yellow-500 px-3 py-2 rounded-lg ">Videos</li>
            </ul>
          </nav>
          
        </aside>
        <main className="flex-grow bg-white p-2 md:p-8 overflow-y-auto">
          {!user && (
            <div className="bg-white rounded-lg border-b-2 mb-4 p-2 w-full text-center">
              <h2 className="text-2xl text-white font-bold mb-2">
                {isNewUser ? "Sign Up" : "Login"}
              </h2>
              <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
                {isNewUser && (
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border-2 rounded flex-grow mb-2 md:mb-0"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 border-2 rounded flex-grow mb-2 md:mb-0"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border-2 rounded flex-grow mb-2 md:mb-0"
                />
                <button
                  onClick={isNewUser ? handleSignUp : handleSignIn}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 md:mt-0 md:ml-2"
                >
                  {isNewUser ? "Sign Up" : "Login"}
                </button>
              </div>
              <p className="text-yellow-500 cursor-pointer" onClick={() => setIsNewUser(!isNewUser)}>
                {isNewUser ? "Already have an account? Log in" : "New here? Sign up"}
              </p>
            </div>
          )}

            <div className=" grid grid-cols-2 gap-4">
          <div className=" md:mb-0 mt-3 ">
        {user && (
            <div className=" md:ml-0 md:mt-6  mb-8 rounded-lg text-center text-black font-semibold ">
              <p className=" text-xl">
                Welcome, <span className="text-yellow-300 text-2xl">{username}</span>
              </p>
              <p>
                Points Earned: <span className="text-yellow-300">{pointsEarned}</span>
              </p>
            </div>
          )}
          </div>

          <div className=" md:mt-6  ">
          
          
          
          {user && (
            <div className="rounded-lg text-center text-white font-semibold ">
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-5 py-1 m-1 rounded-lg hover:bg-red-600 "
              >
                Sign Out
              </button>
            </div>
          )}{user && (
            <div className="  rounded-lg text-center text-white font-semibold ">
              <button
                onClick={generateInviteLink}
                className="bg-black text-white px-8 py-1 m-2 rounded-lg hover:bg-black "
              >
                Invite
              </button>
              {inviteLink && (
                <div className="">
                  <p className="text-black break-words">{inviteLink}</p>
                  
                </div>
              )}
            </div>
          )}
          </div>
          </div>



          <h1 className="text-2xl md:text-4xl font-bold mb-2">Explore</h1>
          <p className="text-gray-600 md:p-0 p-2 mb-4">
            Earn points by completing offers and tasks from our partners.
          </p>
          <div className="relative bg-white rounded-lg shadow-sm  md:p-2 mb-8">
            {!user && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <p className="text-lg font-bold text-black">Sign in to start earning!</p>
                </div>
              </div>
            )}
            <iframe
              src={`${process.env.PUBLIC_URL}/test.html`}
              title="CPA Offers"
              className="w-full rounded-lg h-[650px] md:h-[500px] border-0"
            />
          </div>
          <div className="relative rounded-lg p-1 m-6">
            <h2 className="md:text-2xl text-center font-bold mb-2">More Offers Coming Soon</h2>
            <div className="md:grid md:grid-cols-3  md:gap-4">
              {offerWalls.map((wall, index) => (
                <div key={index} className="bg-white mb-2 py-2 rounded-lg border-2 text-center">
                  <img src={wall.logo} alt={wall.name} className="w-10 h-10 mx-auto mb-4" />
                  <p className="font-semibold">{wall.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-start gap-4 mb-8">
            
            {socialMediaTasks.map((platform, index) => (
              <div key={index} className="bg-black p-2 rounded-lg shadow-sm w-full">

          <h2 className="md:text-2xl text-center text-white font-bold mb-2">
            Earn More By Completing Social Media
          </h2>

          <p className="text-xs md:text-sm text-center text-white  mb-2">
            complete tasks screenshot and get more points
          </p>
                <div className="flex items-center  ">
                  

                  
                </div>
                <ul className="bg-white">
                  {platform.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="p-2 mx-auto">
                      <a href={task.url} className="text-black text-center font-bold hover:underline ">
                        {task.name}
                      </a>
                    </li>
                  ))}
                  <p className="text-xs md:text-sm text-center text-black ">
                     come back later for more tasks
                    </p>
                </ul>

                
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
