import {ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, MEMO_PROGRAM_ID} from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { ACTION } from "next/dist/client/components/app-router-headers";

export async function GET(request: Request) {
  const response: ActionGetResponse =
  {
    icon: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KW1Zwwo4NUX4oFJZEHLbXK9QlSPcUhuR5eWF7VCO2g2sDBR1x4Ghdfua-pLwJywLzBfDBN_si3mL-Yn_jhP7_UhHgA18lwmO7Eu9yh2gzn-0FvMj-lIYDHJ1Q5MF_T_QK6yOe5gce9upvMnyY1vScm5yvD30vgcOTlkPE/512fx384f",
    label: "Dota 2 Item",
    title: "Inscribed Transversant Soul of the Crimson Witness",
    description: "Immortal Shoulder | Easy Transaction with Blinks",
    links:
    {
      actions:[
        {
          label: "1 SOL",
          href: "/api/one-input-actions/1",
        },
        {
          label: "2 SOL",
          href: "/api/one-input-actions/1",
        },
        {
          label: "5 SOL",
          href: "/api/one-input-actions/1",
        },
      ]
    },
    error: 
    {
      message: "This blink is not implemented yet"
    }
  }
  return Response.json(response, {headers: ACTIONS_CORS_HEADERS,});

}

  export const OPTIONS = GET;

  export const POST = async (request: Request) => {
    try {
        const body: ActionPostRequest = await request.json();

        let account: PublicKey;
        try {
          account = new PublicKey(body.account);
        } catch (err) {
          return new Response('Invalid "account" provided', {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
          })
        }


      const transaction = new Transaction()
      transaction.add(

        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
        new TransactionInstruction({
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from("This is a simple memo messag", "utf8"),
          keys: [],
        }),
      );

      transaction.feePayer = account;

      const connection = new Connection(clusterApiUrl("devnet"));
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash


      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction
        },

      })
      return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});

    } catch (err) 
    {
      return Response.json("Unknown error occured", {status: 400});
    }
  }



