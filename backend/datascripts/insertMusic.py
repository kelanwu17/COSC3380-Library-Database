import requests
import json

# Sample JSON data
json_data = [
    {
        "musicGenre": "pop",
        "artist": "Taylor Swift",
        "dateReleased": "2022-10-21",
        "count": 10,
        "albumName": "Midnights",
        "monetaryValue": 14.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/9/9f/Midnights_-_Taylor_Swift.png?20221030194148"
    },
    {
        "musicGenre": "hip-hop",
        "artist": "Drake",
        "dateReleased": "2023-03-02",
        "count": 5,
        "albumName": "Her Loss",
        "monetaryValue": 16.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 2,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Drake_and_21_Savage_-_Her_Loss.png/220px-Drake_and_21_Savage_-_Her_Loss.png"
    },
    {
        "musicGenre": "rock",
        "artist": "Foo Fighters",
        "dateReleased": "2023-05-12",
        "count": 8,
        "albumName": "But Here We Are",
        "monetaryValue": 18.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 3,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Foo_Fighters_-_But_Here_We_Are.png/220px-Foo_Fighters_-_But_Here_We_Are.png"
    },
    {
        "musicGenre": "electronic",
        "artist": "Calvin Harris",
        "dateReleased": "2023-07-14",
        "count": 15,
        "albumName": "Funk Wav Bounces Vol. 2",
        "monetaryValue": 17.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 4,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Calvin_Harris_-_Funk_Wav_Bounces_Vol._2.png/220px-Calvin_Harris_-_Funk_Wav_Bounces_Vol._2.png"
    },
    {
        "musicGenre": "pop",
        "artist": "Dua Lipa",
        "dateReleased": "2022-11-11",
        "count": 20,
        "albumName": "Future Nostalgia",
        "monetaryValue": 14.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png/220px-Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png"
    },
    {
        "musicGenre": "hip-hop",
        "artist": "Kendrick Lamar",
        "dateReleased": "2022-05-13",
        "count": 7,
        "albumName": "Mr. Morale & The Big Steppers",
        "monetaryValue": 19.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 2,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kendrick_Lamar_-_Mr._Morale_%26_the_Big_Steppers.png/220px-Kendrick_Lamar_-_Mr._Morale_%26_the_Big_Steppers.png"
    },
    {
        "musicGenre": "rock",
        "artist": "Paramore",
        "dateReleased": "2023-02-10",
        "count": 12,
        "albumName": "This Is Why",
        "monetaryValue": 15.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 3,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Paramore_-_This_Is_Why.png/220px-Paramore_-_This_Is_Why.png"
    },
    {
        "musicGenre": "electronic",
        "artist": "Deadmau5",
        "dateReleased": "2022-09-16",
        "count": 9,
        "albumName": "We Are Friends Vol. 9",
        "monetaryValue": 13.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 4,
        "imgUrl": "https://f4.bcbits.com/img/a0810901376_16.jpg"
    },
    {
        "musicGenre": "pop",
        "artist": "Ariana Grande",
        "dateReleased": "2023-01-27",
        "count": 11,
        "albumName": "Positions",
        "monetaryValue": 14.99,
        "availabilityStatus": 1,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Ariana_Grande_-_Positions.png/220px-Ariana_Grande_-_Positions.png"
    },
    {
        "musicGenre": "hip-hop",
        "artist": "Lil Nas X",
        "dateReleased": "2023-05-27",
        "count": 6,
        "albumName": "Montero",
        "monetaryValue": 16.49,
        "availabilityStatus": 1,
        "lastUpdatedBy": 2,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Lil_Nas_X_-_Montero.png/220px-Lil_Nas_X_-_Montero.png"
    },
    {
        "musicGenre": "rock",
        "artist": "The Killers",
        "dateReleased": "2022-08-15",
        "count": 10,
        "albumName": "Pressure Machine",
        "monetaryValue": 17.49,
        "availabilityStatus": 1,
        "lastUpdatedBy": 3,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/3/39/The_Killers_-_Pressure_Machine.png/220px-The_Killers_-_Pressure_Machine.png"
    },
]


def post_books(data):
    endpoint = 'https://library-database-backend.onrender.com/api/music/createMusic'  # Replace with your actual endpoint

    for music in data:
        try:
            # Send a POST request with the book data
            response = requests.post(endpoint, json=music)
            response.raise_for_status()  # Raise an error for bad responses

            # Attempt to parse the response as JSON
            print('Success:', response.json())
        except requests.exceptions.HTTPError as err:
            # HTTP errors (4xx, 5xx)
            print(f'Error posting book "{music.get("title", "Unknown title")}":', err)
            print('Response Text:', response.text)  # Print the response text for additional context
        except requests.exceptions.RequestException as req_err:
            # Other request errors (network issues, etc.)
            print(f'Request error occurred: {req_err}')
        except json.JSONDecodeError:
            # Handle JSON decode errors separately
            print(f'Error decoding JSON response for book "{music.get("title", "Unknown title")}":', response.text)

# Sam

# Call the function
post_books(json_data)
