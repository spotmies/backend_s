from geopy.geocoders import Nominatim

Geolocator=Nominatim(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")

cordi=input("Enter location coordinates:")
locationInfo=Geolocator.reverse(cordi)

print(locationInfo.address)

adress=input("Enter adddress:")
loc=Geolocator.geocode(adress)
print(loc.latitude, loc.longitude)