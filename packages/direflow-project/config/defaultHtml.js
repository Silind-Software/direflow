setTimeout(() => {
  if (!document.body.children.length) {
    
    const wrapperDiv = document.createElement('div');
    
    wrapperDiv.innerHTML = `
      <div class="info"><b>In this HTML file, you can consume your Direflow Components during development</b></div>
      <div class="info">Go to <i>public/index.html</i> and add your custom element in the body</div>
      <br />
      <div class="info">For instance:</div>
      <br />
      <div class="code">
        &lt;cool-component&gt;&lt;/cool-component&gt;
      </div>
    `;

    document.body.appendChild(wrapperDiv);
  }
});
