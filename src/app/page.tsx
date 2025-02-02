"use client";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { Editor } from "novel";
import { useState } from "react";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [email, setEmail] = useState(""); 

  const handleUpdate = (editor: any) => {
    const html = editor.getHTML();
    console.log("Contenido HTML", html);
    setHtmlContent(html);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendEmail = async () => {
    if (!email || !validateEmail(email)) {
      iziToast.error({
        title: "Error",
        message: "Por favor, ingresa un correo electrónico válido.",
        position: "topRight",
    
      })
      return;
    }

    if (!htmlContent) {
      iziToast.error({
        title: "Error",
        message: "El contenido HTML está vacío. Escribe algo en el editor antes de enviar.",
        position: "topRight"
      })
      return;
    }


    try {
      const response = await fetch("/api/sendemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email, 
          subject: "POC NOVEL", 
          text: "NOVEL NOVEL NOVEL, Sendgrid", 
          html: htmlContent, 
        })
      });

      const result = await response.json();
      if (response.ok) {

        iziToast.success({
          title: "Correo enviado",
          message: result.message,
          position: "topRight"
        })
        
      } else {
        iziToast.error({
          title: "Correo no enviado",
          message: result.error,
          position: "topRight"
        })

        
      }
    } catch (error) {
      console.error("Error enviando el correo:", error);
      iziToast.error({
        title: "Error",
        message: "Error al enviar el correo. Por favor, intenta de nuevo.",
        position: "topRight"
      })
    }
  };

  return (
    <div className="py-3 m-4 w-1/2 ">
      <p className="text-2xl font-bold text-center">NOVEL SENDGRID POC</p>
      <Editor
        defaultValue={{
          title: "docss",
          content: [],
        }}
        onUpdate={(editor) => handleUpdate(editor)}
        className="shadow "
      />

      <div className="py-4">
        <input
          type="email"
          placeholder="Ingresa un correo"
          value={email}
          onChange={(email) => setEmail(email.target.value)}
          className=" m-4 w-1/2 border border-gray-300 rounded-md p-2" 
        />
        <button
          onClick={handleSendEmail}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
        Enviar
        </button>
      </div>
    </div>
  );
}