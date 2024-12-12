import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    await prisma.bid.deleteMany({});
    await prisma.listing.deleteMany({});
    await prisma.eventLog.deleteMany({});
    await prisma.bundle.deleteMany({});
    
    // Delete NFTs and collections
    await prisma.nFT.deleteMany({});
    await prisma.nFTCollection.deleteMany({});
    
    // Finally, delete users
    await prisma.user.deleteMany({});
    console.log("deleted all");
    
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: 'user1222',
      email: 'user1@example.com',
      address: '0x12345',
      isVerified: true,
      profilePic: 'https://example2.com/profile1.jpg',
      bio: 'NFT creator',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user222',
      email: 'user2@example.com',
      address: '0x67890',
      isVerified: true,
      profilePic: 'https://example1.com/profile2.jpg',
      bio: 'NFT collector',
    },
  });

  // Create Blockchain
  const ethereumBlockchain = await prisma.blockchain.create({
    data: {
      name: 'Ethereum',
      chainId: 1,
      currency: 'ETH',
      explorerUrl: 'https://etherscan.io',
    },
  });

  const polygonBlockchain = await prisma.blockchain.create({
    data: {
      name: 'Polygon',
      chainId: 137,
      currency: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
    },
  });

  // Create NFT Collection
  const collection1 = await prisma.nFTCollection.create({
    data: {
      name: 'Collection 1',
      description: 'First collection',
      royalty: 5,
      creatorId: user1.id,
    },
  });

  const collection2 = await prisma.nFTCollection.create({
    data: {
      name: 'Collection 2',
      description: 'Second collection',
      royalty: 10,
      creatorId: user2.id,
    },
  });

  // Create NFTs
  const nft1 = await prisma.nFT.create({
    data: {
      title: 'NFT 1',
      description: 'This is the first NFT.',
      imageUrl: 'https://example.com/nft1.jpg',
      metadataUrl: 'https://example.com/nft1_metadata',
      ownerAddress: user1.address,
      collectionId: collection1.id,
      royalty: 5,
      royaltyReceiver: user1.address,
      blockchainId: ethereumBlockchain.id,
    },
  });

  const nft2 = await prisma.nFT.create({
    data: {
      title: 'NFT 2',
      description: 'This is the second NFT.',
      imageUrl: 'https://example.com/nft2.jpg',
      metadataUrl: 'https://example.com/nft2_metadata',
      ownerAddress: user2.address,
      collectionId: collection2.id,
      royalty: 10,
      royaltyReceiver: user2.address,
      blockchainId: polygonBlockchain.id,
    },
  });

  // Create Listings
  const listing1 = await prisma.listing.create({
    data: {
      nftId: nft1.id,
      sellerId: user1.id,
      price: 0.5,
      startTime: new Date(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      type: 'AUCTION',
      status: 'ACTIVE',
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      nftId: nft2.id,
      sellerId: user2.id,
      price: 1.0,
      startTime: new Date(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      type: 'FIXED',
      status: 'ACTIVE',
    },
  });

  // Create Bids
  const bid1 = await prisma.bid.create({
    data: {
      listingId: listing1.id,
      bidderId: user2.id,
      amount: 0.6,
    },
  });

  const bid2 = await prisma.bid.create({
    data: {
      listingId: listing1.id,
      bidderId: user1.id,
      amount: 0.7,
    },
  });

  // Create Event Logs
  const eventLog1 = await prisma.eventLog.create({
    data: {
      eventType: 'CREATED',
      eventData: { nftId: nft1.id },
      nftId: nft1.id,
      userId: user1.id,
    },
  });

  const eventLog2 = await prisma.eventLog.create({
    data: {
      eventType: 'LISTED',
      eventData: { listingId: listing1.id },
      listingId: listing1.id,
      userId: user1.id,
    },
  });

  // Create Bundle
  const bundle1 = await prisma.bundle.create({
    data: {
      name: 'Bundle 1',
      description: 'NFT Bundle 1',
      nftIds: [nft1.id, nft2.id],
      price: 1.5,
      sellerId: user1.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
