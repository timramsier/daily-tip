// Get tip type from query parameter (required)
const urlParams = new URLSearchParams(window.location.search);
const tipType = urlParams.get('type');

const tipContent = document.getElementById('tip-content');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

if (tipContent) {
  // Check if type parameter is provided
  if (!tipType) {
    tipContent.innerHTML = `
      <div style="text-align: center;">
        <p style="color: #764ba2; font-size: 18px; margin-bottom: 20px;">
          <strong>Please select a tip type:</strong>
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <a href="?type=leadership-tone" style="padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Leadership Tone</a>
          <a href="?type=productivity-hacks" style="padding: 12px 24px; background: #764ba2; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Productivity Hacks</a>
        </div>
      </div>
    `;
  } else {
    const tipDataKey = `tipData_${tipType.replace(/-/g, '_')}`;

    // Load the appropriate tip data script
    const script = document.createElement('script');
    script.src = `${tipType}.js`;
    script.onload = () => {
      if (win[tipDataKey] && win[tipDataKey].html) {
        tipContent.innerHTML = win[tipDataKey].html;
      } else {
        tipContent.innerHTML = `<p style="color: red;">Tip type '${tipType}' not found. Try <a href="?type=leadership-tone">leadership-tone</a> or <a href="?type=productivity-hacks">productivity-hacks</a>.</p>`;
      }
    };
    script.onerror = () => {
      tipContent.innerHTML = `<p style="color: red;">Failed to load tip type '${tipType}'. Try <a href="?type=leadership-tone">leadership-tone</a> or <a href="?type=productivity-hacks">productivity-hacks</a>.</p>`;
    };
    document.head.appendChild(script);
  }
}
