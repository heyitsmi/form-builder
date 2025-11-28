/**
 * Simple Form Builder Library (Pure JS + SVG)
 * Updated with layout options, custom components, and custom icons.
 */
class FormBuilder {
    constructor(containerId, options = {}) {
        this.container = document.querySelector(containerId);
        if (!this.container) {
            throw new Error(`Container with selector ${containerId} not found.`);
        }
        
        // Merge Options
        this.options = {
            layout: 'left', // 'left' or 'right'
            components: null, // null = all defaults, array = filter/customize
            ...options
        };
        
        this.callbacks = {};
        
        // Default SVG Icons System
        this.icons = {
            text: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm2-9h14v6H5V9zm2 2v2h2v-2H7z" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 4v16M16 4v16" opacity="0.3" /></svg>`, 
            textarea: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>`,
            number: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>`,
            select: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`,
            radio: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
            checkbox: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>`,
            date: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
            file: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>`,
            
            // UI Icons
            arrow_up: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>`,
            arrow_down: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`,
            trash: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
            plus: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>`,
            x: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
            pencil: `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>`,
            list: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`,
            radio_real: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /></svg>`,
            checkbox_real: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
        };

        // Default Component Definitions
        this.defaultComponents = [
            { type: 'text', label: 'Text Field', icon: 'text' },
            { type: 'textarea', label: 'Text Area', icon: 'textarea' },
            { type: 'number', label: 'Number', icon: 'number' },
            { type: 'select', label: 'Dropdown', icon: 'list' },
            { type: 'radio', label: 'Radio', icon: 'radio' },
            { type: 'checkbox', label: 'Checkbox', icon: 'checkbox' },
            { type: 'date', label: 'Date', icon: 'date' },
            { type: 'file', label: 'File Upload', icon: 'file' },
        ];

        if (this.options.icons) {
            this.icons = { ...this.icons, ...this.options.icons };
        }

        this.init();
    }

    init() {
        this.renderLayout();
        this.bindEvents();
    }

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    renderLayout() {
        const wrapperClass = this.options.layout === 'right' ? 'fb-wrapper fb-sidebar-right' : 'fb-wrapper';

        this.container.innerHTML = `
            <div class="${wrapperClass}">
                <!-- Sidebar (Toolbox) -->
                <aside class="fb-sidebar">
                    <div class="fb-sidebar-header">
                        <span style="color: var(--fb-primary);">${this.getIcon('pencil', 'width: 1.25rem;')}</span> Components
                    </div>
                    <div class="fb-toolbox" id="fb-toolbox"></div>
                </aside>

                <!-- Canvas Area -->
                <div class="fb-canvas-area">
                    <div class="fb-canvas" id="fb-canvas"></div>
                    <div class="fb-empty" id="fb-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300" style="width: 4rem; height: 4rem; color: #d1d5db; margin-bottom: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
                        <p style="color: #9ca3af; font-weight: 500;">Drag or Click fields</p>
                    </div>
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('#fb-canvas');
        this.toolbox = this.container.querySelector('#fb-toolbox');
        this.emptyState = this.container.querySelector('#fb-empty');
        
        this.renderToolbox();
    }

    renderToolbox() {
        let componentsToRender = this.defaultComponents;

        if (this.options.components) {
            componentsToRender = this.options.components.map(c => {
                if (typeof c === 'string') {
                    return this.defaultComponents.find(d => d.type === c);
                } 
                else if (typeof c === 'object' && c.type) {
                    const def = this.defaultComponents.find(d => d.type === c.type);
                    return { ...def, ...c }; 
                }
                return null;
            }).filter(Boolean);
        }

        componentsToRender.forEach(item => {
            const el = document.createElement('div');
            el.className = 'fb-item';
            el.draggable = true;
            el.dataset.type = item.type;
            
            const iconHtml = item.iconHtml ? item.iconHtml : this.getIcon(item.icon, 'width: 1.25rem; height: 1.25rem;');

            el.innerHTML = `
                <span style="color: #6b7280; display: flex;">${iconHtml}</span>
                <span>${item.label}</span>
            `;
            el.addEventListener('click', () => this.addComponent(item.type));
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', item.type);
                el.classList.add('dragging');
            });
            el.addEventListener('dragend', () => el.classList.remove('dragging'));
            this.toolbox.appendChild(el);
        });
    }

    bindEvents() {
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.canvas.classList.add('drop-active');
            this.checkEmpty();
        });

        this.canvas.addEventListener('dragleave', () => this.canvas.classList.remove('drop-active'));

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.canvas.classList.remove('drop-active');
            const type = e.dataTransfer.getData('type');
            if (type) this.addComponent(type);
        });

        this.canvas.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const action = btn.dataset.action;
            const field = btn.closest('.fb-field');
            if (!field) return;

            if (action === 'delete') {
                if(confirm('Delete field?')) {
                    field.remove();
                    this.checkEmpty();
                }
            } else if (action === 'move-up') {
                if (field.previousElementSibling) field.parentNode.insertBefore(field, field.previousElementSibling);
            } else if (action === 'move-down') {
                if (field.nextElementSibling) field.parentNode.insertBefore(field.nextElementSibling, field);
            } else if (action === 'add-option') {
                this.addOption(field);
            } else if (action === 'delete-option') {
                const row = btn.closest('.fb-option-row');
                if (row.parentNode.children.length > 1) row.remove();
                else alert('Min 1 option required');
            }
        });
        
        this.canvas.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('fb-helper') && e.target.innerText.trim() === 'Add helper text...') {
                e.target.innerText = '';
                e.target.style.fontStyle = 'normal';
                e.target.style.color = '#4b5563';
            }
        });
        
        this.canvas.addEventListener('focusout', (e) => {
            if (e.target.classList.contains('fb-helper') && e.target.innerText.trim() === '') {
                e.target.innerText = 'Add helper text...';
                e.target.style.fontStyle = 'italic';
                e.target.style.color = '#9ca3af';
            }
        });
    }

    addComponent(type) {
        const id = 'f_' + Date.now();
        const html = this.generateFieldHtml(type, id);
        const range = document.createRange();
        const frag = range.createContextualFragment(html);
        this.canvas.appendChild(frag);
        this.checkEmpty();
        setTimeout(() => {
            const newEl = this.canvas.lastElementChild;
            if(newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    }
    
    addOption(fieldEl) {
        const container = fieldEl.querySelector('.fb-options-list');
        const type = fieldEl.dataset.type;
        const newRow = document.createElement('div');
        newRow.className = 'fb-option-row';
        newRow.style = 'display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;';
        newRow.innerHTML = this.generateOptionRow(type, `Option ${container.children.length + 1}`);
        container.appendChild(newRow);
    }

    checkEmpty() {
        this.emptyState.style.display = this.canvas.children.length > 0 ? 'none' : 'flex';
    }

    getIcon(name, style = '') {
        const svg = this.icons[name] || this.icons.text;
        if (svg.trim().startsWith('<svg')) {
            return svg.replace('<svg ', `<svg style="${style}" `);
        }
        return `<span style="${style}">${svg}</span>`;
    }

    generateFieldHtml(type, id) {
        let label = 'Untitled Question';
        
        let content = '';
        if (['text', 'number', 'textarea'].includes(type)) {
            const height = type === 'textarea' ? '5rem' : '2.5rem';
            content = `
                <div class="fb-input-visual" style="height: ${height}; display: flex; align-items: center; padding: 0 0.5rem;">
                     <input type="text" class="fb-ghost-input" placeholder="Type placeholder..." style="width:100%; border:none; background:transparent; outline:none; font-size:0.875rem;">
                </div>
            `;
        } else if (type === 'date') {
            content = `<div style="height: 2.5rem; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.5rem; display: flex; align-items: center; padding: 0 0.5rem; color: #9ca3af; gap: 0.5rem;">${this.getIcon('date', 'width:1.25rem')} <span>dd/mm/yyyy</span></div>`;
        } else if (type === 'file') {
            content = `<div style="height: 6rem; border: 2px dashed #d1d5db; border-radius: 0.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">${this.getIcon('file', 'width:2rem')} <span style="font-size: 0.8rem;">File Upload</span></div>`;
        } else if (['select', 'radio', 'checkbox'].includes(type)) {
            content = `
                <div class="fb-options-list">
                    <div class="fb-option-row" style="display: flex; gap: 0.5rem; align-items: center;">${this.generateOptionRow(type, 'Option 1')}</div>
                </div>
                <button data-action="add-option" style="margin-top: 0.5rem; color: #2563eb; background: none; border: none; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem;">
                    ${this.getIcon('plus', 'width:1rem')} Add Option
                </button>
            `;
        }

        return `
            <div class="fb-field" data-id="${id}" data-type="${type}">
                <div class="fb-actions">
                    <button class="fb-btn" data-action="move-up" title="Up">${this.getIcon('arrow_up', 'width:1rem')}</button>
                    <button class="fb-btn" data-action="move-down" title="Down">${this.getIcon('arrow_down', 'width:1rem')}</button>
                    <div style="width: 1px; background: #e5e7eb; margin: 0 0.25rem;"></div>
                    <button class="fb-btn delete" data-action="delete" title="Delete">${this.getIcon('trash', 'width:1rem')}</button>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <label class="fb-label" contenteditable="true">${label}</label>
                </div>
                ${content}
                <div class="fb-field-footer">
                    <div class="fb-helper" contenteditable="true">Add helper text...</div>
                    <div class="fb-toggle-wrapper">
                        <span class="fb-toggle-label">Required</span>
                        <label class="fb-switch">
                            <input type="checkbox" class="required-toggle fb-required">
                            <span class="fb-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    generateOptionRow(type, val) {
        let iconSvg = type === 'select' ? this.getIcon('list', 'width:1.25rem; color:#d1d5db') : 
                    type === 'radio' ? `<div style="width:1rem; height:1rem; border:2px solid #d1d5db; border-radius:50%;"></div>` : 
                    `<div style="width:1rem; height:1rem; border:2px solid #d1d5db; border-radius:2px;"></div>`;

        return `
            ${iconSvg}
            <input type="text" value="${val}" style="border:none; border-bottom: 1px solid transparent; background: transparent; flex: 1; font-size: 0.875rem; padding: 0.25rem;" placeholder="Option label">
            <button class="fb-btn delete" data-action="delete-option" title="Remove">${this.getIcon('x', 'width:0.8rem')}</button>
        `;
    }

    getJson() {
        const items = this.canvas.querySelectorAll('.fb-field');
        return Array.from(items).map(item => {
            const data = {
                id: item.dataset.id,
                type: item.dataset.type,
                label: item.querySelector('.fb-label').innerText,
                helper: item.querySelector('.fb-helper').innerText === 'Add helper text...' ? '' : item.querySelector('.fb-helper').innerText,
                required: item.querySelector('.fb-required').checked
            };
            if (['select', 'radio', 'checkbox'].includes(data.type)) {
                data.options = Array.from(item.querySelectorAll('input[type="text"]')).map(i => i.value);
            }
            const ph = item.querySelector('.fb-ghost-input');
            if (ph) data.placeholder = ph.value;
            return data;
        });
    }
}