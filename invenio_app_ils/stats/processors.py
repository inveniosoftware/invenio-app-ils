def add_timestamp_as_unique_id(doc):
    """Add the timestamp as unique_id to the event."""
    doc["unique_id"] = f"{doc.get('timestamp')}"
    return doc
