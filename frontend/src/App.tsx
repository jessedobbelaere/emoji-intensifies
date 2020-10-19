import React from "react";
import "./App.css";
import ImageDragDrop from "./components/ImageDragDrop/ImageDragDrop";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={require("./logo.gif")} alt="logo" />
            </header>
            <main className="image-upload-container">
                <ImageDragDrop />
            </main>
        </div>
    );
}

export default App;
