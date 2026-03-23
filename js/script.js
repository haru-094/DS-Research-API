const search_input = document.getElementById('search-input');
const sort_select = document.getElementById('select-sorting');
const open_source = document.getElementById('open-source');
const search_btn = document.getElementById('search-btn');
const result_container = document.getElementById('getting-data');

search_btn.addEventListener('click', () => {
    const query = search_input.value.trim();

    if (!query) {
        result_container.innerHTML = '<p>Please type a topic to search first.</p>';
        return;
    }

    result_container.innerHTML = '<p>Fetching data science research...</p>';
    fetchResearch(query);
});

async function fetchResearch(query) {
    try {
        const baseUrl = 'https://api.openalex.org/works';

        let filters = 'concepts.id:C119857082';

        if (open_source.checked) {
            filters += ',is_oa:true';
        }

        let sort_method = sort_select.value + ':desc';

        const finalUrl = `${baseUrl}?search=${encodeURIComponent(query)}&filter=${filters}&sort=${sort_method}&per-page=12`;

        const response = await fetch(finalUrl);
        const data = await response.json();

        displayResults(data.results);

    } catch (error) {
        console.error("Error:", error);
        result_container.innerHTML = '<p>Error connecting to the database. Please try again.</p>';
    }
}

function displayResults(papers) {
    result_container.innerHTML = '';

    if (papers.length === 0) {
        result_container.innerHTML = '<p>No papers found. Try another search term.</p>';
        return;
    }

    papers.forEach(paper => {
        const title = paper.title || 'Untitled Paper';
        const year = paper.publication_year || 'Unknown Year';
        const citations = paper.cited_by_count || 0;
        const link = paper.doi || (paper.primary_location ? paper.primary_location.landing_page_url : '#');

        const paperCard = `
            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #fff;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.2rem; color: #2c3e50;">${title}</h3>
                <p style="margin: 0 0 10px 0; color: #555;">
                    <strong>Year:</strong> ${year} | <strong>Citations:</strong> ${citations}
                </p>
                <a href="${link}" target="_blank" style="display: inline-block; padding: 8px 12px; background: #3498db; color: white; text-decoration: none; border-radius: 4px;">Read PDF</a>
            </div>
        `;

        result_container.innerHTML += paperCard;
    });
}