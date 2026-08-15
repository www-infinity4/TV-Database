# Model and Orchestration Zone

This zone routes prompts to local or hosted models through one Mongoose
contract. llama.cpp and Ollama are local execution candidates; LiteLLM remains
in license review; LangGraph is a state-machine reference.

The zone never gives a model direct merge access. Models propose typed intents.
Builder, validator, security, and publisher carts decide what may advance.
