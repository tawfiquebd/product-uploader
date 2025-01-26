  document.getElementById('fetchProduct').addEventListener('click', async () => {
    try {

      fetchProducts();

      // // Replace with your Laravel API endpoint
      // const apiUrl = 'http://127.0.0.1:8000/api/products';

      // // Fetch product details from the backend
      // const response = await fetch(apiUrl);
      // if (!response.ok) throw new Error('Failed to fetch product details.');

      // const product = await response.json();
      // console.log('Product fetched:', product);

      // // Inject product details into Facebook Marketplace form
      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   chrome.scripting.executeScript({
      //     target: { tabId: tabs[0].id },
      //     func: injectProductDetails,
      //     args: [product],
      //   });
      // });


    } catch (error) {
      console.error('Error fetching product:', error);
    }
  });
    
// Function to inject product details into Facebook Marketplace form
function injectProductDetails(product) {
  console.log('here injectProductDetails' , product);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (product) => {
        const titleField = document.querySelector('input[aria-label="Title"]');
        const priceField = document.querySelector('input[aria-label="Price"]');
        const descriptionField = document.querySelector('textarea[aria-label="Description"]');
console.log('working', product);
        if (titleField) titleField.value = product.name;
        if (priceField) priceField.value = product.price;
        if (descriptionField) descriptionField.value = product.description || 'No description provided';
      },
      args: [product],
    });
  });
}
  
  function fetchProducts() {
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const product = response.json();
        injectProductDetails(product);

        return product;
      })
      .then((data) => {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = ''; // Clear previous content
        
        data.data.forEach((product) => {
          const productElement = document.createElement('div');

          productElement.className = 'product';
          productElement.innerHTML = `
            <img src="${product.image}" alt="image" style="width: 30px; height: 30px;" />
            <p style="font-size: 13px; font-weight: bold;">${product.name}</p>
            <p style="font-size: 11px; font-weight: bold;">${product.price} USD</p>
          `;
          
          productContainer.appendChild(productElement);
        });
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }

  document.getElementById('upload-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const imageFile = document.getElementById('product-image').files[0];
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', imageFile);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload product');
      }
  
      const data = await response.json();
      console.log('Product uploaded successfully:', data);
      alert('Product uploaded successfully!');
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  });