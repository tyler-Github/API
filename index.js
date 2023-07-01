<!-- index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title>API Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <link rel="stylesheet" href="/dashboard.css">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="/">Yasifys</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/">Home</a>
          </li>
          <!-- Add additional navigation links here -->
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="row mt-5">
      <div class="col-lg-6 offset-lg-3">
        <div class="card shadow-lg">
          <div class="card-body">
            <h4 class="card-title">API Dashboard</h4>
            <form id="requestForm">
              <div class="mb-3">
                <label for="method" class="form-label">Request Type:</label>
                <select class="form-select" id="method" name="method" required>
                  <option class="GetRequest" value="get">GET</option>
                  <option class="PostRequest" value="post">POST</option>
                  <option class="PutRequest" value="put">PUT</option>
                  <option class="DeleteRequest" value="delete">DELETE</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="url" class="form-label">URL:</label>
                <input type="text" class="form-control" id="url" name="url" placeholder="Enter URL" required>
              </div>
              <div id="headers-container">
                <h6 class="mb-3">Headers:</h6>
                <div class="input-group mb-2">
                  <input type="text" class="form-control" name="headerKey[]" placeholder="Enter header key">
                  <input type="text" class="form-control" name="headerValue[]" placeholder="Enter header value">
                  <button class="btn btn-outline-secondary remove-header-btn" type="button">Remove</button>
                </div>
              </div>
              <center>
                <button class="btn btn-outline-primary add-header-btn" type="button">Add Header</button>
                <button type="submit" class="btn btn-outline-primary add-header-btn">Send Request</button>
              </center>
            </form>

            <div id="responseContainer" class="mt-4" style="display: none;">
              <h5 class="mb-3">Response:</h5>
              <div class="request">
                <div class="request-header">Request</div>
                <div class="request-body">
                  <div><strong>Method:</strong> <span id="requestMethod"></span></div>
                  <div><strong>URL:</strong> <span id="requestURL"></span></div>
                  <div><strong>Headers:</strong></div>
                  <ul id="requestHeaders"></ul>
                </div>
                <div class="request-response">
                  <div class="request-header">Response</div>
                  <pre><code class="json" id="responseJSON"></code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.socket.io/4.3.1/socket.io.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const socket = io();

      const requestForm = document.getElementById('requestForm');
      const responseContainer = document.getElementById('responseContainer');
      const requestMethodElement = document.getElementById('requestMethod');
      const requestURLElement = document.getElementById('requestURL');
      const requestHeadersElement = document.getElementById('requestHeaders');
      const responseJSONElement = document.getElementById('responseJSON');

      requestForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const method = document.getElementById('method').value;
        const url = document.getElementById('url').value;
        const headerKeys = document.getElementsByName('headerKey[]');
        const headerValues = document.getElementsByName('headerValue[]');

        const headers = Array.from(headerKeys).map((keyElement, index) => {
          const valueElement = headerValues[index];
          return { key: keyElement.value, value: valueElement.value };
        });

        socket.emit('request', { method, url, headers });
      });

      socket.on('response', (response) => {
        responseContainer.style.display = 'block';
        requestMethodElement.textContent = response.request.method;
        requestURLElement.textContent = response.request.url;

        requestHeadersElement.innerHTML = '';
        response.request.headers.forEach((header) => {
          const li = document.createElement('li');
          li.textContent = `${header.key}: ${header.value}`;
          requestHeadersElement.appendChild(li);
        });

        responseJSONElement.textContent = JSON.stringify(response.data, null, 2);
      });
    });
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script> 
  <script>
    document.querySelector('.add-header-btn').addEventListener('click', () => {
      const headersContainer = document.querySelector('#headers-container');
      const inputGroup = document.createElement('div');
      inputGroup.classList.add('input-group', 'mb-2');
      inputGroup.innerHTML = `
        <input type="text" class="form-control" name="headerKey[]" placeholder="Enter header key">
        <input type="text" class="form-control" name="headerValue[]" placeholder="Enter header value">
        <button class="btn btn-outline-secondary remove-header-btn" type="button">Remove</button>
      `;
      headersContainer.appendChild(inputGroup);

      const removeHeaderBtns = document.querySelectorAll('.remove-header-btn');
      removeHeaderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          btn.parentElement.remove();
        });
      });
    });
  </script>
</body>
</html>
