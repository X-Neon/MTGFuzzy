import json
import requests
from typing import List


def get_card_image_uris(card: dict) -> List[str]:
    if "image_uris" in card:
        return [card["image_uris"]["normal"]]

    if "card_faces" in card:
        return [f["image_uris"]["normal"] for f in card["card_faces"]]

    raise RuntimeError("No card image")


def main() -> None:
    bulk_data = requests.get("https://api.scryfall.com/bulk-data/oracle-cards").json()
    card_uri = bulk_data["download_uri"]
    cards = requests.get(card_uri).json()

    legal_cards = [c for c in cards if c["multiverse_ids"]]
    names = [{"name": c["name"], "uri": c["scryfall_uri"], "image": get_card_image_uris(c)} for c in legal_cards]

    with open("assets/cards.json", "w") as f:
        json.dump(names, f)


if __name__ == "__main__":
    main()