// Código CSS en una cadena de texto
const chatbotStyles = `
    #chatbot-button {
        position: fixed;
        bottom: 25px;
        right: 20px;
        background-color: #000000;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        z-index: 1000;
    }

    #chatbot-button img {
        width: 20px;
        margin-right: 10px;
    }

    #chatbot-container {
        display: none;
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        background: #e0e0e0;
        flex-direction: column;
        z-index: 999;
        overflow: hidden;
    }

    #chatbot-header {
        background-color: #000000;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    #chatbot-header img {
        width: 40px;
        height: 40px;
        border-radius: 90%;
        margin-right: 10px;
    }

    #chatbot-header h1 {
        font-size: 18px;
        margin: 0;
    }

    #chatbot-header p {
        font-size: 12px;
        margin: 0;
    }

    #close-chatbot {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
    }

    #chatbot-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        border-bottom: 1px solid #ccc;
        background: #f9f9f9;
    }

    #chatbot-input-container {
        display: flex;
    }

    #chatbot-input {
        flex: 1;
        padding: 15px;
        border: none;
        border-radius: 0 0 0 10px;
        background: #ddd;
        color: #333;
        font-size: 14px;
    }

    #chatbot-send-button {
        background-color: #000000;
        color: white;
        border: none;
        padding: 15px;
        border-radius: 0 0 10px 0;
        cursor: pointer;
        font-size: 14px;
    }
`;

// Insertar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = chatbotStyles;
document.head.appendChild(styleSheet);

// Crear el botón del chatbot
const chatbotButton = document.createElement('button');
chatbotButton.id = 'chatbot-button';
chatbotButton.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/ffffff/chat.png" alt="Icono del chatbot">';
document.body.appendChild(chatbotButton);

// Crear el contenedor del chatbot
const chatbotContainer = document.createElement('div');
chatbotContainer.id = 'chatbot-container';
chatbotContainer.innerHTML = `
    <div id="chatbot-header">
        <div style="display: flex; align-items: center;">
            <img src="https://i.postimg.cc/qRBBkzng/Captura-de-pantalla-2024-02-27-102418.png" alt="Logo">
            <div>
                <h1>Dan de Surcan🟢</h1>
                <p>Powered By LinBerAI</p>
            </div>
        </div>
        <button id="close-chatbot">&times;</button>
    </div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-container">
        <input type="text" id="chatbot-input" placeholder="Escribe un mensaje..." onkeypress="handleKeyPress(event)">
        <button id="chatbot-send-button">Enviar</button>
    </div>
`;
document.body.appendChild(chatbotContainer);

function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    container.style.display = (container.style.display === 'none' || container.style.display === '') ? 'flex' : 'none';
}

document.getElementById('chatbot-button').addEventListener('click', toggleChatbot);
document.getElementById('close-chatbot').addEventListener('click', toggleChatbot);

function toggleChatbot() {
            const chatbotContainer = document.getElementById('chatbot-container');
            if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
                chatbotContainer.style.display = 'flex';
            } else {
                chatbotContainer.style.display = 'none';
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        async function sendMessage() {
            const message = document.getElementById('chatbot-input').value;
            if (message.trim() === "") return;

            // Agregar mensaje del usuario
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user-message');
            userMessageElement.innerText = message;
            document.getElementById('chatbot-messages').appendChild(userMessageElement);
            document.getElementById('chatbot-input').value = '';

            // Desplazar hacia abajo
            document.getElementById('chatbot-messages').scrollTop = document.getElementById('chatbot-messages').scrollHeight;

            try {
                const response = await fetch('https://anywayv9-jwl7.onrender.com/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                  
                });

                const data = await response.json();
                displayBotMessage(data);
            } catch (error) {
                console.error('Error sending message:', error);
                displayBotMessage({ response: 'Lo siento, hubo un problema al procesar tu solicitud.' });
            }
        }

          function displayBotMessage(data) {
            const chatbotMessages = document.getElementById('chatbot-messages');

            // Eliminar carrusel anterior si existe
            const existingCarousel = document.querySelector('.carousel');
            if (existingCarousel) {
                chatbotMessages.removeChild(existingCarousel);
            }

            const botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'bot-message');

            // Mostrar mensaje de recomendación si la respuesta está vacía pero hay un carrusel
            if (!data.response && data.carousel) {
                botMessageElement.classList.add('recommendation-message');
                botMessageElement.innerText = 'Esto es lo que te recomendaría';
                chatbotMessages.appendChild(botMessageElement);
            } else if (data.response) {
                botMessageElement.innerText = data.response;
                chatbotMessages.appendChild(botMessageElement);
            }

            // Mostrar carrusel si existe
            if (data.carousel) {
                const carouselWrapper = document.createElement('div');
                carouselWrapper.classList.add('carousel');

                const leftArrow = document.createElement('button');
                leftArrow.classList.add('carousel-arrow', 'left');
                leftArrow.innerHTML = '&#9664;';
                leftArrow.onclick = () => scrollCarousel(-1.1);

                const rightArrow = document.createElement('button');
                rightArrow.classList.add('carousel-arrow', 'right');
                rightArrow.innerHTML = '&#9654;';
                rightArrow.onclick = () => scrollCarousel(1.1);

                const carouselContainer = document.createElement('div');
                carouselContainer.classList.add('carousel-container');

                data.carousel.forEach(item => {
                    const carouselItem = document.createElement('div');
                    carouselItem.classList.add('carousel-item');

                    const image = document.createElement('img');
                    image.src = item.image_url;  // Asegúrate de que image_url esté bien configurado
                    image.alt = item.title;      // Añadir texto alternativo para accesibilidad
                    carouselItem.appendChild(image);

                    const title = document.createElement('div');
                    title.classList.add('carousel-item-title');
                    title.innerText = item.title;
                    carouselItem.appendChild(title);

                    const price = document.createElement('div');
                    price.classList.add('carousel-item-price');
                    price.innerText = item.subtitle;
                    carouselItem.appendChild(price);

                    const button = document.createElement('a');
                    button.classList.add('carousel-item-button');
                    button.href = item.default_action.url;
                    button.innerText = 'Ver Producto';
                    carouselItem.appendChild(button);

                    carouselContainer.appendChild(carouselItem);
                });

                carouselWrapper.appendChild(leftArrow);
                carouselWrapper.appendChild(carouselContainer);
                carouselWrapper.appendChild(rightArrow);

                chatbotMessages.appendChild(carouselWrapper);
            }

            // Añadir margen después del carrusel
            const spacer = document.createElement('div');
            spacer.style.marginBottom = '20px';
            chatbotMessages.appendChild(spacer);

            // Desplazar hacia abajo
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        let currentScrollPosition = 0;

        function scrollCarousel(direction) {
            const carouselContainer = document.querySelector('.carousel-container');
            const carouselWidth = carouselContainer.scrollWidth;
            const visibleWidth = document.querySelector('.carousel').clientWidth;
            const maxScrollPosition = carouselWidth - visibleWidth;

            currentScrollPosition += direction * 200; // Ajustar distancia de desplazamiento según sea necesario
            if (currentScrollPosition < 0) currentScrollPosition = 0;
            if (currentScrollPosition > maxScrollPosition) currentScrollPosition = maxScrollPosition;

            carouselContainer.style.transform = `translateX(-${currentScrollPosition}px)`;
        }
