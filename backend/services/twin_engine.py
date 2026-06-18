class TwinEngine:
    @staticmethod
    def calculate_new_state(current_state: dict, emissions_change_percent: float) -> dict:
        """
        emissions_change_percent: negative means reduction (good), positive means increase (bad)
        """
        new_state = current_state.copy()
        
        # We can fine-tune these multipliers based on how much the user reduced/increased
        if emissions_change_percent < 0:
            # Good behavior
            new_state["forest"] = min(100, new_state.get("forest", 50) + 5)
            new_state["water"] = min(100, new_state.get("water", 50) + 2)
            new_state["air"] = min(100, new_state.get("air", 50) + 4)
            new_state["wildlife"] = min(100, new_state.get("wildlife", 50) + 3)
        elif emissions_change_percent > 0:
            # Bad behavior
            new_state["forest"] = max(0, new_state.get("forest", 50) - 3)
            new_state["air"] = max(0, new_state.get("air", 50) - 5)
            new_state["water"] = max(0, new_state.get("water", 50) - 1)
            new_state["wildlife"] = max(0, new_state.get("wildlife", 50) - 2)
            
        # Overall planet health
        new_state["planet"] = (new_state["forest"] + new_state["water"] + new_state["air"] + new_state["wildlife"]) / 4.0
        
        return new_state

    @staticmethod
    def initialize_twin() -> dict:
        return {
            "forest": 50,
            "water": 50,
            "air": 50,
            "wildlife": 50,
            "planet": 50
        }
