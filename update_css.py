with open('css/contacts.css', 'a', encoding='utf-8') as f:
    f.write("""
/* QUOTE FORM */
.quote-form-container {
    background: #fff;
    padding: 30px;
    border-radius: var(--radius-md, 14px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    height: 100%;
}
.quote-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.quote-form input, .quote-form select, .quote-form textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    font-size: 15px;
    box-sizing: border-box;
}
.quote-form input:focus, .quote-form select:focus, .quote-form textarea:focus {
    outline: none;
    border-color: var(--accent-color, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
""")
