document.getElementById('fetchProduct').addEventListener('click', async () => {
  try {
    await fetchProducts();
  } catch (error) {
    console.error('Error fetching product:', error);
  }
});



// Clear button event
document.getElementById('clear-form').addEventListener('click', clearForm);

function clearForm() {
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-image').value = '';
  document.getElementById('product-category').value = '';
  document.getElementById('product-condition').value = '';
}

document.getElementById('reload-page').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
  });
});


function downloadImage(imageUrl, fileName) {
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // Set file name for download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log('Image downloaded:', fileName);
    })
    .catch(error => console.error('Error downloading image:', error));
}

// Function to inject product details into Facebook Marketplace form
function injectProductDetails(product) {
  console.log('Starting injection for product:', product);
  // Download the image before injecting
  if (product.image) {
    const fileName = `product-${Date.now()}.jpg`; // Generate unique name
    downloadImage(product.image, fileName);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (product) => {
        const inject = () => {
          // Locate inputs by traversing the label
          const titleLabel = document.querySelector('label[aria-label="Title"]');
          const priceLabel = document.querySelector('label[aria-label="Price"]');
          const descriptionLabel = document.querySelector('label[aria-label="Description"]');
        
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


          async function injectCategory(categoryText) {
            try {
                console.log("🔍 Attempting to inject category:", categoryText);
        
                // Step 1: Check if dropdown is already open
                let dropdownMenu = document.querySelector('div[aria-label="Dropdown menu"][role="dialog"]');
                
                if (!dropdownMenu) {
                    console.log("➡️ Opening category dropdown...");
                    const categoryDropdown = document.querySelector('[aria-label="Category"]');
                    if (!categoryDropdown) {
                        console.error(" Category dropdown button not found.");
                        return;
                    }
        
                    categoryDropdown.click(); // Open dropdown
        
                    // Wait for dropdown to appear
                    await new Promise(resolve => setTimeout(resolve, 1000));
        
                    // Re-check if dropdown is open
                    dropdownMenu = document.querySelector('div[aria-label="Dropdown menu"][role="dialog"]');
                    if (!dropdownMenu) {
                        console.error(" Dropdown did not open.");
                        return;
                    }
                }
        
                console.log(" Dropdown is open!");
        
                // Step 2: Wait a bit to stabilize UI
                await new Promise(resolve => setTimeout(resolve, 500));
        
                // Step 3: Find category options
                const categoryOptions = Array.from(dropdownMenu.querySelectorAll('div.x1lq5wgf.xgqcy7u.x30kzoy'));
        
                console.log(" Available categories:", categoryOptions.map(opt => opt.innerText.trim()));
        
                // Step 4: Match and click the correct category
                const matchingOption = categoryOptions.find(option => option.innerText.trim() === categoryText);
        
                if (matchingOption) {
                    console.log(` Found category: ${categoryText}`);
        
                    // Ensure it's visible
                    matchingOption.scrollIntoView({ behavior: "smooth", block: "center" });
        
                    // Step 5: Click the category after a short delay
                    setTimeout(() => {
                        matchingOption.dispatchEvent(new Event("mousedown", { bubbles: true }));
                        matchingOption.dispatchEvent(new Event("mouseup", { bubbles: true }));
                        matchingOption.dispatchEvent(new Event("click", { bubbles: true }));
        
                        console.log(` Successfully selected category: ${categoryText}`);
        
                        // Extra delay to allow UI to register selection
                        setTimeout(() => console.log("✅ Selection should now be registered!"), 1000);
                    }, 500);
                } else {
                    console.error(` Category "${categoryText}" not found in dropdown options.`);
                }
        
            } catch (error) {
                console.error(" Error injecting category:", error);
            }
        }
                    
          
        // Inject Condition (More Reliable)
        async function injectCondition(conditionText) {
          const conditionDropdown = document.querySelector('[aria-label="Condition"]');
          if (!conditionDropdown) {
            return false;
          }

          conditionDropdown.click(); 

          setTimeout(() => {
            const conditionOptions = Array.from(document.querySelectorAll('div[role="menuitem"], div[role="option"]'));                      

            const matchingOption = conditionOptions.find(option => option.innerText.trim() === conditionText);

            if (matchingOption) {
              matchingOption.click();
              console.log(`Injected condition: ${conditionText}`);
            } else {
              console.error(`Condition "${conditionText}" not found.`);
            }
          }, 3000); // Wait for dropdown to load
        }
          
        injectCategory(product.category);
        injectCondition(product.condition);

        // Call the upload function with the local image path
        try {
          console.log('Uploading local image:');
          window.imageUploadTriggered = false; // Prevent multiple triggers

          if (!window.imageUploadTriggered) {
            const fileInput = document.querySelector('input[type="file"][accept*="image/"]');
            if (fileInput) {
              fileInput.click();

              window.imageUploadTriggered = true; // Prevent multiple triggers
              console.log('Prompting user to select an image manually.');
            } else {
              console.error('File input not found.');
            }
          }
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
          if (success || attempts >= 0) {
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

async function fetchProducts() {
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
          <p>Category: ${product.category}</p>
          <p>Condition: ${product.condition}</p>
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
  const category = document.getElementById('product-category').value; // Get selected category
  const condition = document.getElementById('product-condition').value; // Get selected condition


  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('image', imageFile);
  formData.append('category', category);
  formData.append('condition', condition); // Add condition . s
  

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
    clearForm();
  } catch (error) {
    console.error('Error uploading product:', error);
  }
});


async function fetchCategories() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const categories = await response.json();
    const categoryDropdown = document.getElementById('product-category');

    // Clear existing options
    categoryDropdown.innerHTML = '<option value="">Select a Category</option>';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryDropdown.appendChild(option);
    });

    console.log('Categories loaded successfully');
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', fetchCategories);