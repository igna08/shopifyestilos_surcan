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
                const response = await fetch('https://pilper-7.onrender.com/chat', {
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
