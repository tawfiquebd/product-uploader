  document.getElementById('fetchProduct').addEventListener('click', async () => {
    try {
      // Replace with your Laravel API endpoint
      const apiUrl = 'http://127.0.0.1:8000/api/products';

      // Fetch product details from the backend
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch product details.');

      const product = await response.json();
      console.log('Product fetched:', product);

      // Inject product details into Facebook Marketplace form
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: injectProductDetails,
          args: [product],
        });
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  });
    
  // Function to inject product details into Facebook Marketplace
  function injectProductDetails(product) {
    const titleField = document.querySelector('input[aria-label="Title"]');
    const priceField = document.querySelector('input[aria-label="Price"]');
    const descriptionField = document.querySelector('textarea[aria-label="Description"]');
  
    if (titleField) titleField.value = product.title;
    if (priceField) priceField.value = product.price;
    if (descriptionField) descriptionField.value = product.description;
  }
  