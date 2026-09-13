function generateLuxuryCopy(rawProduct) {
  const brand = rawProduct.brand || 'Fabras Signature';
  const movement = rawProduct.movement || 'Precision Japanese Quartz';
  const caseMaterial = rawProduct.case_material || '316L Surgical Grade Stainless Steel';
  const dialColor = rawProduct.dial_color || 'Obsidian Black';
  const strap = rawProduct.strap || 'Genuine Hand-Stitched Leather / Solid Steel Link';
  const waterResistance = rawProduct.water_resistance || '3 ATM (Splash Resistant)';
  const gender = rawProduct.gender || 'Men';

  const cleanTitle = `${brand} ${rawProduct.model_name || 'Classique'} | ${dialColor} Dial ${movement} ${gender}'s Luxury Watch`;

  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const shortDescription = `Elevate your everyday presence with the ${brand} ${rawProduct.model_name || 'Classique'}. Featuring an artisanal ${dialColor.toLowerCase()} dial and ultra-reliable ${movement}. Available at a flat introductory price of ₹499.`;

  const specifications = {
    "Brand": brand,
    "Model Series": rawProduct.model_name || "V1 Edition",
    "Movement": movement,
    "Dial Color": dialColor,
    "Case Diameter": rawProduct.diameter || "42 mm",
    "Case Thickness": rawProduct.thickness || "10.5 mm",
    "Case Material": caseMaterial,
    "Strap Material": strap,
    "Glass Type": "Scratch-Resistant Mineral Crystal",
    "Water Resistance": waterResistance,
    "Warranty": "6 Months Machine Warranty",
    "Packaging": "Premium Fabras Hard Shell Presentation Box"
  };

  const description = `
<h3>The Epitome of Modern Horology — ${brand}</h3>
<p>${shortDescription}</p>
<h4>Craftsmanship & Engineering</h4>
<p>Each timepiece is built with high-grade ${caseMaterial.toLowerCase()} and scratch-resistant mineral crystal for day-to-day durability. The ${dialColor.toLowerCase()} dial with faceted hour markers delivers balanced readability and styling for both formal events and everyday wear.</p>
<h4>Key Highlights:</h4>
<ul>
  <li><strong>Movement:</strong> Engineered with ${movement} for reliable timekeeping.</li>
  <li><strong>Ergonomics:</strong> Fitted with an adjustable ${strap.toLowerCase()} for daily comfort.</li>
  <li><strong>Authenticity & Quality:</strong> Quality-inspected before dispatch.</li>
</ul>
`.trim();

  const category = "Watches > Men's Watches > Analog Luxury Watches";
  const tags = ["Fabras", "Luxury Watch", "Wrist Watch", dialColor, movement, "Online Goods by Jatin", "Men Accessories"].join(', ');

  const seoTitle = `${cleanTitle} — Best Price ₹499 | Online Goods by Jatin`;
  const metaDescription = `Buy the ${brand} ${rawProduct.model_name || 'Classique'} (${dialColor} Dial) for ₹499 at Online Goods by Jatin (Fabras). Direct shipping with COD & direct UPI payment options.`;

  return {
    ai_title: cleanTitle,
    slug,
    short_description: shortDescription,
    description,
    specifications: JSON.stringify(specifications),
    category,
    tags,
    seo_title: seoTitle,
    meta_description: metaDescription
  };
}

module.exports = { generateLuxuryCopy };
