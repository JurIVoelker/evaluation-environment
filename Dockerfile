FROM oven/bun:alpine AS base
WORKDIR /workspace

# Install mui dependencies
COPY mui/package.json ./mui/
RUN cd mui && bun i

# Install shadcn dependencies
COPY shadcn/package.json ./shadcn/
RUN cd shadcn && bun i

COPY package.json .
RUN bun i

# Copy all files
COPY . .

EXPOSE 3000