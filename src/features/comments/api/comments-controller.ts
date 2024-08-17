import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments-service';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
import { CommentInputDto } from './dto/input/comment-input-dto';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { CommentViewDto } from './dto/output/comment-view-dto';
import { IsOwnerCommentGuard } from '../../../common/guards/is-owner-comment-guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':cardId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create comment for card' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the newly created comment',
        type: CommentViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: "If card doesn't exists",
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async createComment(
        @Param('cardId') cardId: string,
        @Body() commentInputDto: CommentInputDto,
        @CurrentUserId() userId: string,
    ) {
        const commentInterLayer = await this.commentsService.createComment(
            commentInputDto,
            userId,
            cardId,
        );

        if (commentInterLayer.hasError()) {
            throw new NotFoundException();
        }

        return commentInterLayer.data;
    }

    @UseGuards(IsOwnerCommentGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete comment' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Comment is delete',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: "If comment doesn't exists",
    })
    @ApiForbiddenResponse({
        description: "If User doesn't owner comment",
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async deleteComment(@Param('commentId') commentId: string) {
        const commentInterLayer =
            await this.commentsService.deleteComment(commentId);

        if (commentInterLayer.hasError()) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':commentId')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get comment' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: CommentViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: "If comment doesn't exists",
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async getComment(@Param('commentId', ParseUUIDPipe) commentId: string) {
        const commentInterLayer =
            await this.commentsService.getComment(commentId);

        if (commentInterLayer.hasError()) {
            throw new NotFoundException();
        }

        return commentInterLayer.data;
    }

    @UseGuards(IsOwnerCommentGuard)
    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update comment' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Comment was updated',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'If user is not owner comment',
    })
    @ApiNotFoundResponse({
        description: "If comment doesn't exists",
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async updateComment(
        @Param('commentId', ParseUUIDPipe) commentId: string,
        @Body() commentInputDto: CommentInputDto,
    ) {
        const commentInterLayer = await this.commentsService.updateComment(
            commentId,
            commentInputDto,
        );

        if (commentInterLayer.hasError()) {
            throw new NotFoundException();
        }
    }
}
