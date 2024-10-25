import { useEffect, useState } from 'react'

function App() {
  const [posts, setPosts] = useState<any[]>([])
  const [viewport, setViewport] = useState({ x: window.innerWidth, y: window.innerHeight })

  const generateTwoUniqueRandomNumbers = (maxVal: number) => {
    const first = Math.floor(Math.random() * maxVal);
    let second;

    do {
      second = Math.floor(Math.random() * maxVal);
    } while (second === first); // Ensure the second number is different from the first

    return [first, second];
  }

  const getYTid = (htmlStr: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html')
    const iframe = doc.querySelector("iframe")
    if (iframe) {
      const src = iframe.getAttribute("src")
      console.log(src);
      if (src) {
        const sections = src.split('/')
        const id = sections[4].split('?')[0]
        return id
      }
    }
  }

  const getParsedTitle = (htmlStr: string) => {

    const parser = new DOMParser().parseFromString(htmlStr, "text/html");
    return parser.documentElement.textContent;
  }

  useEffect(() => {
    // Fetch the data from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://junglejims.com/wp-json/wp/v2/posts?categories=223');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const [index1, index2] = generateTwoUniqueRandomNumbers(data.length);
        //console.log(index1, index2); // Outputs two unique random numbers
        //console.log(data);

        setPosts([data[index1], data[index2]]); // Set the fetched posts to state
      } catch (error) {
        //console.error('Error fetching data:', error);
      }
    };
    fetchPosts(); // Call the fetch function inside useEffect

    const refreshViewport = () => {
      setViewport({ x: window.innerWidth, y: window.innerHeight })
    }

    window.addEventListener('resize', refreshViewport);

    return () => window.removeEventListener('resize', refreshViewport);
  }, []);

  return (
    <>
      <div style={{borderBottom: `1px solid #4e3111`}}>
        <h2 style={{textAlign: 'left'}}>Recommended for You</h2>
        <div style={{ display: 'flex', width: '100%', justifyContent: " space-between", gap: '3%', flexDirection: `${viewport.x <= 650 ? `column` : `row`}` }}>
          {posts.map((post, index) => {
            return <div key={index} style={{ width: `${viewport.x <= 650 ? `100%` : `50%`}` }}>
              <a href={post.guid.rendered} style={{ textDecoration: 'none' }}>
                {<img style={{
                  width: '100%',
                  objectFit: 'cover',
                  aspectRatio: '16 / 9'
                }}
                  src={`https://img.youtube.com/vi/${getYTid(post.content.rendered)}/hqdefault.jpg`}></img>}
                <h4 style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 2,
                  maxWidth: '100%',
                }}>{getParsedTitle(post.title.rendered)}</h4>
              </a>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
