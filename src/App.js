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
        { name: "Follow us", url: "https://facebook.com/follow" },
        { name: "Like our latest post", url: "https://facebook.com/latest-post" },
        { name: "Share our page", url: "https://facebook.com/share" },
      ],
    },
    {
      platform: "Twitter",
      icon: "https://via.placeholder.com/40?text=TW",
      tasks: [
        { name: "Follow us", url: "https://twitter.com/follow" },
        { name: "Retweet our pinned tweet", url: "https://twitter.com/retweet" },
        { name: "Like our tweet", url: "https://twitter.com/like" },
      ],
    },
    {
      platform: "Twitter",
      icon: "https://via.placeholder.com/40?text=TW",
      tasks: [
        { name: "Follow us", url: "https://twitter.com/follow" },
        { name: "Retweet our pinned tweet", url: "https://twitter.com/retweet" },
        { name: "Like our tweet", url: "https://twitter.com/like" },
      ],
    },
    {
      platform: "Twitter",
      icon: "https://via.placeholder.com/40?text=TW",
      tasks: [
        { name: "Follow us", url: "https://twitter.com/follow" },
        { name: "Retweet our pinned tweet", url: "https://twitter.com/retweet" },
        { name: "Like our tweet", url: "https://twitter.com/like" },
      ],
    },
  ];

  
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      
      <aside className="bg-black text-white w-full md:w-64 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Gain Sphere</h1>
        </div>
        <nav className="flex-grow hidden mt-6 md:block">
          <ul className="space-y-4">
            <li className="text-yellow-500 font-semibold">Coming Soon</li>
            <li className="hover:bg-yellow-500  px-3 py-2 rounded-lg ">Surveys</li>
            <li className="hover:bg-yellow-500 px-3 py-2 rounded-lg ">Videos</li>
          </ul>
        </nav>

       
        {user && (
          <div className="mt-6 p-4 bg-black rounded-lg text-center text-white font-semibold shadow-md">
            <p>
              Welcome, <span className="text-yellow-300">{username}</span>
            </p>
            <p>
              Points Earned: <span className="text-yellow-300">{pointsEarned}</span>
            </p>
          </div>
        )}

        
        {user && (
          <div className="mt-4 p-2 bg-white rounded-lg text-center text-white font-semibold shadow-md">
            <button
              onClick={generateInviteLink}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-600 w-full"
            >
              Generate Invite Link
            </button>
            {inviteLink && (
              <div className="mt-4">
                <p className="text-yellow-300 break-words">{inviteLink}</p>
                <button
                  onClick={handleCopyLink}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-2 w-full"
                >
                  {copySuccess ? "Copied!" : "Copy Link"}
                </button>
              </div>
            )}
          </div>
        )}

        
        {user && (
          <div className="mt-4">
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      
      <main className="flex-grow bg-white p-6 md:p-8 overflow-y-auto">
       
        {!user && (
          <div className="bg-white rounded-lg border-b-2 mb-4  p-2 w-full text-center">
            <h2 className="text-2xl text-white  font-bold mb-2">{isNewUser ? "Sign Up" : "Login"}</h2>
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

        <h1 className="text-4xl font-bold mb-2">Explore</h1>
        <p className="text-gray-600 mb-4">Earn points by completing offers and tasks from our partners.</p>

        
        <div className="relative bg-white rounded-lg shadow-sm p-4 mb-8">
          
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
            className="w-full rounded-lg h-64 md:h-[500px] border-0"
          />
        </div>

            
        <div className="relative rounded-lg p-1 m-6">
          
        
          <h2 className="text-2xl text-center font-bold mb-4">More Offers Coming Soon</h2>
          <div className="grid grid-cols-3 gap-4">
            {offerWalls.map((wall, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-2 text-center">
                <img src={wall.logo} alt={wall.name} className="w-10 h-10 mx-auto mb-4" />
                <p className="font-semibold">{wall.name}</p>
              </div>
            ))}
          </div>
        </div>

        
        <h2 className="text-2xl text-center font-bold mb-4">Earn More By Completing Social Media</h2>
            <div className="flex justify-start gap-4 mb-8">

              

        {socialMediaTasks.map((platform, index) => (
          <div key={index} className="bg-black p-4 rounded-lg shadow-sm w-1/4 md:w-1/2 lg:w-1/4">
            <div className="flex items-center mb-4">
              <img src={platform.icon} alt={platform.platform} className="w-12 h-12 mr-4" />
              <h3 className="text-xl text-yellow-500  font-semibold">{platform.platform}</h3>
            </div>
            <ul className="space-y-3">
              {platform.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  <a href={task.url} className="text-white hover:underline">
                    {task.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> 
      </main>
    </div>
  );
}

export default App;
