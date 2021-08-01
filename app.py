import sys
from geopy.geocoders import Nominatim
placeName = sys.argv[1]
trigger = sys.argv[2]
# print("sekhar"+first)
Geolocator=Nominatim(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")

# cordi=input("Enter location coordinates:")
# locationInfo=Geolocator.reverse(cordi)

# print(locationInfo.address)

# adress=input("Enter adddress:")
if trigger =="getgeocode":
  try:
      loc=Geolocator.geocode(placeName)
      if loc:
        print(loc.latitude, loc.longitude)
      else:
          print("404")

  except ValueError:
      print("500")
else:
  locationInfo=Geolocator.reverse(placeName)
  print(locationInfo)


# print(loc.latitude, loc.longitude)

