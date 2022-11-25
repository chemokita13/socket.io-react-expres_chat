import "./App.css";
import io from "socket.io-client";
import { SOCKET_PORT } from "./config";
import { useState, useEffect } from "react";

const socket = io(SOCKET_PORT);

function App() {
    const [SendMsg, setSendMsg] = useState(""); // msg content to send
    const [saveMsg, setSaveMsg] = useState([]);
    const handleSubmitForm = (e) => {
        e.preventDefault();
        socket.emit("msg", SendMsg);
        setSendMsg("");
        setSaveMsg([...saveMsg, { msg: SendMsg, author: "me" }]);
    };

    useEffect(() => {
        const reciveMsg = (msgObject) => {
            console.log(msgObject);
            setSaveMsg([...saveMsg, msgObject]);
        };
        socket.on("msg", (msgObject) => reciveMsg(msgObject));

        return () => {
            socket.on("msg", (msgObject) => reciveMsg(msgObject));
        };
    }, [saveMsg]);

    return (
        <div className="h-screen bg-blue-300 flex row-auto justify-between">
            <div className="p-5 m-10 bg-blue-300 max-w-md">
                {saveMsg.map((item, index) => (
                    <div key={index}>
                        <div className="flex row-auto">
                            <div className="via-cyan-300">({item.author})</div>
                            :&nbsp; {item.msg}
                        </div>
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => handleSubmitForm(e)}
                className="p-5 py-40 bg-blue-700 flex flex-col text-center"
            >
                <input
                    className="rounded-md bg-blue-300 text-blue-700 pl-3"
                    type="text"
                    name="msg"
                    autoFocus
                    onChange={(e) => setSendMsg(e.target.value)}
                    value={SendMsg}
                />
                <button className="mt-2 border-2 border-blue-300 rounded-lg text-blue-300 capitalize hover:bg-blue-300 hover:text-blue-700">
                    send
                </button>
            </form>
        </div>
    );
}

export default App;
