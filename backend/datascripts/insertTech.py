import requests
import json

# Sample JSON data
json_data = [
    {
        "deviceName": "Dell XPS 15",
        "modelNumber": "XPS159500SLV",
        "count": 12,
        "availabilityStatus": 1,
        "monetaryValue": 1899.99,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/DELL_XPS_13_and_15_%2837080596413%29.jpg/1200px-DELL_XPS_13_and_15_%2837080596413%29.jpg"
    },
    {
        "deviceName": "Apple iPad Pro",
        "modelNumber": "ML0A3LL/A",
        "count": 20,
        "availabilityStatus": 1,
        "monetaryValue": 799.00,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Wikipedia_on_iPad_Pro.jpg/440px-Wikipedia_on_iPad_Pro.jpg"
    },
    {
        "deviceName": "HP Spectre x360",
        "modelNumber": "14-ea0003dx",
        "count": 8,
        "availabilityStatus": 1,
        "monetaryValue": 1399.99,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/HP_Spectre_x360_2016_%2832003550180%29.jpg/1920px-HP_Spectre_x360_2016_%2832003550180%29.jpg"
    },
    {
        "deviceName": "Samsung Galaxy Tab S8",
        "modelNumber": "SM-X800",
        "count": 15,
        "availabilityStatus": 1,
        "monetaryValue": 699.99,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/20230729_%EC%82%BC%EC%84%B1_%EA%B0%A4%EB%9F%AD%EC%8B%9C_%ED%83%AD_S9.jpg/220px-20230729_%EC%82%BC%EC%84%B1_%EA%B0%A4%EB%9F%AD%EC%8B%9C_%ED%83%AD_S9.jpg"
    },
    {
        "deviceName": "Lenovo ThinkPad X1 Carbon",
        "modelNumber": "20U30035US",
        "count": 10,
        "availabilityStatus": 1,
        "monetaryValue": 1699.99,
        "lastUpdatedBy": 1,
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lenovo_ThinkPad_X1_Ultrabook.jpg/220px-Lenovo_ThinkPad_X1_Ultrabook.jpg"
    }
]



def post_books(data):
    endpoint = 'https://library-database-backend.onrender.com/api/technology/createTechnology'  # Replace with your actual endpoint

    for tech in data:
        try:
            # Send a POST request with the book data
            response = requests.post(endpoint, json=tech)
            response.raise_for_status()  # Raise an error for bad responses

            # Attempt to parse the response as JSON
            print('Success:', response.json())
        except requests.exceptions.HTTPError as err:
            # HTTP errors (4xx, 5xx)
            print(f'Error posting book "{tech.get("title", "Unknown title")}":', err)
            print('Response Text:', response.text)  # Print the response text for additional context
        except requests.exceptions.RequestException as req_err:
            # Other request errors (network issues, etc.)
            print(f'Request error occurred: {req_err}')
        except json.JSONDecodeError:
            # Handle JSON decode errors separately
            print(f'Error decoding JSON response for book "{tech.get("title", "Unknown title")}":', response.text)

# Sam

# Call the function
post_books(json_data)
