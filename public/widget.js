(function() {
  // 1. Get workspace slug from script tag attributes
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const workspaceSlug = currentScript.getAttribute('data-workspace');
  if (!workspaceSlug) {
    console.error('FeatLoop Widget: data-workspace attribute is missing from script tag.');
    return;
  }

  // Resolve origin of the script to make iframe URL dynamic (works on localhost & production)
  const scriptUrl = new URL(currentScript.src);
  const origin = scriptUrl.origin;

  // 2. Create iframe container
  const iframe = document.createElement('iframe');
  iframe.src = `${origin}/widget/${workspaceSlug}`;
  iframe.id = 'featloop-widget-iframe';
  
  // Style iframe
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '380px',
    height: '520px',
    border: '1px solid #27272a',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    zIndex: '999999',
    opacity: '0',
    pointerEvents: 'none',
    transform: 'translateY(10px) scale(0.95)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    backgroundColor: '#09090b',
  });

  document.body.appendChild(iframe);

  // 3. Create Floating Button (FAB)
  const button = document.createElement('button');
  button.id = 'featloop-widget-trigger';
  
  // Style Button
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: '#f4f4f5',
    color: '#09090b',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    zIndex: '999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  });

  // MessageSquare SVG Icon (default) and Close (X) SVG
  const messageIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  button.innerHTML = messageIcon;
  document.body.appendChild(button);

  // 4. Toggle functionality
  let isOpen = false;

  button.addEventListener('click', function() {
    isOpen = !isOpen;

    if (isOpen) {
      // Open modal
      button.innerHTML = closeIcon;
      button.style.backgroundColor = '#27272a';
      button.style.color = '#f4f4f5';
      
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'all';
      iframe.style.transform = 'translateY(0) scale(1)';
    } else {
      // Close modal
      button.innerHTML = messageIcon;
      button.style.backgroundColor = '#f4f4f5';
      button.style.color = '#09090b';

      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.transform = 'translateY(10px) scale(0.95)';
    }
  });

  // Add hover effect
  button.addEventListener('mouseenter', function() {
    button.style.transform = 'scale(1.05)';
  });
  button.addEventListener('mouseleave', function() {
    button.style.transform = 'scale(1)';
  });

})();
