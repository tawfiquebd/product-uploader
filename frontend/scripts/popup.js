document.getElementById('fetchProduct').addEventListener('click', async () => {
  try {
    fetchProducts();
  } catch (error) {
    console.error('Error fetching product:', error);
  }
});

// Function to inject product details into Facebook Marketplace form
function injectProductDetails(product) {
  console.log('Starting injection for product:', product);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (product) => {
        const inject = () => {
          // Locate inputs by traversing the label
          const titleLabel = document.querySelector('label[aria-label="Title"]');
          const priceLabel = document.querySelector('label[aria-label="Price"]');
          const descriptionLabel = document.querySelector('label[aria-label="Description"]');
          const imageUploadField = document.querySelector('input[type="file"]');

          const titleField = titleLabel ? titleLabel.querySelector('input') : null;
          const priceField = priceLabel ? priceLabel.querySelector('input') : null;
          const descriptionField = descriptionLabel ? descriptionLabel.querySelector('textarea') : null;

          // Check and populate fields
          if (titleField) {
            titleField.value = product.name;
            titleField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('Injected title:', product.name);
          } else {
            console.error('Title field not found.');
          }

          if (priceField) {
            priceField.value = product.price;
            priceField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('Injected price:', product.price);
          } else {
            console.error('Price field not found.');
          }

          if (descriptionField) {
            descriptionField.value = product.description || 'No description provided';
            descriptionField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('Injected description:', product.description);
          } else {
            console.error('Description field not found.');
          }

          
          // Call the upload function with the local image path
          try {
            console.log('Uploading local image:');
        
            // Locate the file input field
            const fileInput = document.querySelector('input[type="file"][accept*="image/"]');
            if (!fileInput) {
              console.error('File input not found.');
              return;
            }
   
            fileInput.click();
        
            console.log('Prompting user to select an image manually.');
          } catch (err) {
            console.error('Error during image upload:', err);
          }

          // Return success if all fields were found and populated
          return titleField && priceField && descriptionField;
        };

        // Retry mechanism for dynamic content
        let attempts = 0;
        const interval = setInterval(() => {
          const success = inject();
          attempts++;
          if (success || attempts > 1) {
            clearInterval(interval);
            if (!success) {
              console.error('Failed to inject product details after multiple attempts.');
            }
          }
        }, 500); // Retry every 500ms
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

      return response.json();
    })
    .then((data) => {
      const productContainer = document.getElementById('product-container');
      productContainer.innerHTML = ''; // Clear previous content

      data.data.forEach((product) => {
        const productElement = document.createElement('div');

        productElement.className = 'product';
        productElement.innerHTML = `
          <img src="${product.image}" alt="image" style="width: 100px; height: 100px;" />
          <p style="font-size: 13px; font-weight: bold;">${product.name}</p>
          <p style="font-size: 11px; font-weight: bold;">${product.price} USD</p>
          <button class="inject-btn">Inject</button>
        `;

        productElement.querySelector('.inject-btn').addEventListener('click', () => {
          injectProductDetails(product);
        });

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
