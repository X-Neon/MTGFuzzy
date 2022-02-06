import json
import requests


def main() -> None:
    bulk_data = requests.get("https://api.scryfall.com/bulk-data/oracle-cards").json()
    card_uri = bulk_data["download_uri"]
    cards = requests.get(card_uri).json()

    cards_with_images = [c for c in cards if "image_uris" in c and "normal" in c["image_uris"]]
    names = [{"name": c["name"], "uri": c["scryfall_uri"], "image": c["image_uris"]["normal"]} for c in cards_with_images]

    with open("assets/cards.json", "w") as f:
        json.dump(names, f)


if __name__ == "__main__":
    main()