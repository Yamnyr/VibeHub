
from detoxify import Detoxify

# each model takes in either a string or a list of strings

results = Detoxify('multilingual').predict('connard enculé sale pute')



print(results)
