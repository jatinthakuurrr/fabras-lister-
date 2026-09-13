अगली फ़ाइल बनाने के लिए, 'Create new file' पर टैप करें और इस बार फ़ाइल का नाम 'server/storzuAdapter.js' रखें। फिर नीचे दिए गए कोड को पेस्ट करके 'Commit changes' करें:

```javascript
class StorzuAdapter {
  constructor() {
    this.baseUrl = process.env.STORZU_API_BASE_URL || '';
    this.apiKey = process.env.STORZU_API_KEY || '';
    this.storeId = process.env.STORZU_STORE_ID || '';
  }

  isConfigured() {
    return Boolean(this.baseUrl &amp;&amp; this.apiKey);
  }

  async testConnection() {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        message: 'Storzu official API credentials not detected. The application is running in Safe Queue &amp; CSV/JSON Export Mode.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/store/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Store-Id': this.storeId,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return { success: true, isConfigured: true, message: 'Connected to Storzu Storefront API.' };
      } else {
        return { success: false, isConfigured: true, message: `Storzu rejected credentials (Status: ${response.status})` };
      }
    } catch (err) {
      return { success: false, isConfigured: true, message: `Connection attempt failed: ${err.message}` };
    }
  }

  async publishProduct(product) {
    if (!this.isConfigured()) {
      return {
        success: false,
        mode: 'SAFE_QUEUE',
        message: 'Product held in export queue. Live publishing requires an official Storzu API key.'
      };
    }

    try {
      const payload = {
        name: product.ai_title,
        price: product.selling_price,
        currency: 'INR',
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock,
        category: product.category,
        images: JSON.parse(product.images || '[]'),
        attributes: JSON.parse(product.specifications || '{}')
      };

      const response = await fetch(`${this.baseUrl}/v1/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Store-Id': this.storeId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, storzu_product_id: data.id || 'STORZU-' + Date.now() };
      } else {
        return { success: false, message: data.message || 'Storzu API Error' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  generateStorzuExportPayload(products) {
    return products.map(p =&gt; ({
      "Handle / SKU": p.sku,
      "Product Name": p.ai_title,
      "Selling Price (INR)": p.selling_price,
      "Supplier Cost (Internal)": p.supplier_price,
      "Stock Status": p.stock &gt; 0 ? "In Stock" : "Out of Stock",
      "Inventory Quantity": p.stock,
      "Category": p.category,
      "Tags": p.tags,
      "Summary": p.short_description,
      "Full Description": p.description,
      "Image URLs": JSON.parse(p.images || '[]').join('; '),
      "SEO Title": p.ai_title,
      "SEO Description": p.short_description
    }));
  }
}

module.exports = new StorzuAdapter();
```
