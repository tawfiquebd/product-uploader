
  
  // Function to inject product details into Facebook Marketplace
  function injectProductDetails(product) {
    const titleField = document.querySelector('input[aria-label="Title"]');
    const priceField = document.querySelector('input[aria-label="Price"]');
    const descriptionField = document.querySelector('textarea[aria-label="Description"]');
  
    if (titleField) titleField.value = product.title;
    if (priceField) priceField.value = product.price;
    if (descriptionField) descriptionField.value = product.description;
  }
  