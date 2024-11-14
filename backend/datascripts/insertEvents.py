import requests
import json

# Sample JSON data
json_data = [
   
    {
        "title": "Kids Craft Workshop",
        "location": "Main Library",
        "ageGroup": "kid",
        "category": "Arts & Crafts",
        "eventCreator": 1,
        "eventHolder": 2,
        "timeDate": "2024-11-22 10:30:00"
    },
    {
        "title": "Teen Coding Bootcamp",
        "location": "Community Center",
        "ageGroup": "teen",
        "category": "Technology",
        "eventCreator": 1,
        "eventHolder": 3,
        "timeDate": "2024-11-25 16:00:00"
    },

    {
        "title": "Adult Book Discussion",
        "location": "Westside Library",
        "ageGroup": "adult",
        "category": "Literature",
        "eventCreator": 1,
        "eventHolder": 4,
        "timeDate": "2024-12-05 14:00:00"
    },

    {
        "title": "Kid's Holiday Storytime",
        "location": "Library Garden",
        "ageGroup": "kid",
        "category": "Literacy",
        "eventCreator": 1,
        "eventHolder": 3,
        "timeDate": "2024-12-15 09:30:00"
    },

]



def post_books(data):
    endpoint = 'https://library-database-backend.onrender.com/api/event/createEvent'  # Replace with your actual endpoint

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
