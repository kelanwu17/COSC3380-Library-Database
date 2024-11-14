import requests
import json

# Sample JSON data
json_data = [
 
  {
    "title": "Wuthering Heights",
    "genre": "romance",
    "ageCategory": "adult",
    "count": 4,
    "aisle": 2,
    "description": "A classic tale of intense and tragically romantic love set on the Yorkshire moors.",
    "author": "Emily Bronte",
    "isbn": "9780141439556",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 13.99,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/61Ap7QjGMjL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "The Odyssey",
    "genre": "adventure",
    "ageCategory": "teen",
    "count": 5,
    "aisle": 3,
    "description": "Homer's epic poem following the adventures of Odysseus as he journeys home from the Trojan War.",
    "author": "Homer",
    "isbn": "9780140268867",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 11.50,
    "lastUpdatedBy": 1,
    "imgUrl": "https://images.booksense.com/images/867/268/9780140268867.jpg"
  },
  {
    "title": "Anna Karenina",
    "genre": "romance",
    "ageCategory": "adult",
    "count": 3,
    "aisle": 4,
    "description": "A tale of love, society, and tragedy in Imperial Russia.",
    "author": "Leo Tolstoy",
    "isbn": "9780143035009",
    "publisher": "Penguin Classics",
    "edition": "2nd",
    "monetaryValue": 14.99,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/71dfDiH-BKL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "The Brothers Karamazov",
    "genre": "mystery",
    "ageCategory": "adult",
    "count": 2,
    "aisle": 6,
    "description": "Dostoevsky's last novel, exploring moral, philosophical, and theological questions.",
    "author": "Fyodor Dostoevsky",
    "isbn": "9780140449242",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 12.75,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/71OZJsgZzQL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "Les Miserables",
    "genre": "history",
    "ageCategory": "adult",
    "count": 4,
    "aisle": 7,
    "description": "Victor Hugo's masterpiece about justice, love, and redemption set during the French Revolution.",
    "author": "Victor Hugo",
    "isbn": "9780140444308",
    "publisher": "Penguin Classics",
    "edition": "3rd",
    "monetaryValue": 18.50,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/914ou95ewEL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "Dracula",
    "genre": "horror",
    "ageCategory": "teen",
    "count": 6,
    "aisle": 5,
    "description": "A Gothic horror novel that introduced Count Dracula to the world.",
    "author": "Bram Stoker",
    "isbn": "9780141439846",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 9.99,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/71xcDXkr1OL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "The Divine Comedy",
    "genre": "history",
    "ageCategory": "adult",
    "count": 3,
    "aisle": 8,
    "description": "Dante Alighieri's epic journey through Hell, Purgatory, and Heaven.",
    "author": "Dante Alighieri",
    "isbn": "9780142437223",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 16.00,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/51i-9SGWr-L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "Frankenstein",
    "genre": "horror",
    "ageCategory": "adult",
    "count": 4,
    "aisle": 6,
    "description": "A scientist's attempt to create life leads to tragic consequences.",
    "author": "Mary Shelley",
    "isbn": "9780199537150",
    "publisher": "Lackington, Hughes, Harding, Mavor & Jones",
    "edition": "1st",
    "monetaryValue": 14.00,
    "lastUpdatedBy": 1,
    "imgUrl": "https://www.magicmurals.com/media/amasty/webp/catalog/product/cache/155d73b570b90ded8a140526fcb8f2da/a/d/adg-0000001045_1_jpg.webp"
  },
  {
    "title": "Heart of Darkness",
    "genre": "mystery",
    "ageCategory": "adult",
    "count": 2,
    "aisle": 9,
    "description": "Conrad's exploration of the dark side of imperialism and human nature.",
    "author": "Joseph Conrad",
    "isbn": "9781668506455",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 10.99,
    "lastUpdatedBy": 1,
    "imgUrl": "https://prodimage.images-bn.com/pimages/9781668506455_p0_v1_s1200x630.jpg"
  },
  {
    "title": "The Scarlet Letter",
    "genre": "history",
    "ageCategory": "adult",
    "count": 4,
    "aisle": 7,
    "description": "A novel about sin, punishment, and redemption set in Puritan New England.",
    "author": "Nathaniel Hawthorne",
    "isbn": "9780142437261",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 8.50,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/71F3+fvrf4L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "Kautilya's Arthashastra",
    "genre": "history",
    "ageCategory": "adult",
    "count": 3,
    "aisle": 9,
    "description": "An ancient Indian treatise on statecraft, politics, and economics.",
    "author": "Kautilya",
    "isbn": "9780140455201",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 19.50,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/91lh2LgvORL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "Don Quixote",
    "genre": "adventure",
    "ageCategory": "teen",
    "count": 5,
    "aisle": 4,
    "description": "The comedic and philosophical tale of a man who believes he is a knight.",
    "author": "Miguel de Cervantes",
    "isbn": "9780142437230",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 13.75,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/71mbJoazlCL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "The Aeneid",
    "genre": "action",
    "ageCategory": "adult",
    "count": 6,
    "aisle": 5,
    "description": "The story of Aeneas's journey to find Rome, as written by Virgil.",
    "author": "Virgil",
    "isbn": "9780140449327",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 14.99,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/81zVphu918L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "title": "The Iliad",
    "genre": "history",
    "ageCategory": "adult",
    "count": 5,
    "aisle": 3,
    "description": "Homer's epic poem about the Trojan War and the wrath of Achilles.",
    "author": "Homer",
    "isbn": "9780140445926",
    "publisher": "Penguin Classics",
    "edition": "1st",
    "monetaryValue": 12.50,
    "lastUpdatedBy": 1,
    "imgUrl": "https://m.media-amazon.com/images/I/918nUan3EDL._AC_UF1000,1000_QL80_.jpg"
  }


    # Add other book objects here...
]

def post_books(data):
    endpoint = 'https://library-database-backend.onrender.com/api/books/createBook'  # Replace with your actual endpoint

    for book in data:
        try:
            # Send a POST request with the book data
            response = requests.post(endpoint, json=book)
            response.raise_for_status()  # Raise an error for bad responses

            # Attempt to parse the response as JSON
            print('Success:', response.json())
        except requests.exceptions.HTTPError as err:
            # HTTP errors (4xx, 5xx)
            print(f'Error posting book "{book.get("title", "Unknown title")}":', err)
            print('Response Text:', response.text)  # Print the response text for additional context
        except requests.exceptions.RequestException as req_err:
            # Other request errors (network issues, etc.)
            print(f'Request error occurred: {req_err}')
        except json.JSONDecodeError:
            # Handle JSON decode errors separately
            print(f'Error decoding JSON response for book "{book.get("title", "Unknown title")}":', response.text)

# Sam

# Call the function
post_books(json_data)
